import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import prisma from '../prisma/client'

// Схема валидации связи Mod <-> Tag
const ModTagSchema = z.object({
  modId: z.string().uuid('Неверный UUID мода'),
  tagId: z.string().uuid('Неверный UUID тега')
})

const modTagRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  /* ───── GET /api/mod-tags ───── */
  fastify.get('/api/mod-tags', async (_req, reply) => {
    const modTags = await prisma.modTag.findMany({
      include: { mod: true, tag: true }
    })

    reply.send({ success: true, count: modTags.length, data: modTags })
  })

  /* ───── GET /api/mod-tags/:modId/:tagId ───── */
  fastify.get<{ Params: { modId: string; tagId: string } }>(
    '/api/mod-tags/:modId/:tagId',
    async (req, reply) => {
      const { modId, tagId } = req.params

      const modTag = await prisma.modTag.findUnique({
        where: { modId_tagId: { modId, tagId } },
        include: { mod: true, tag: true }
      })

      if (!modTag) {
        return reply.status(404).send({ error: 'Связь ModTag не найдена' })
      }

      reply.send({ success: true, data: modTag })
    }
  )

  /* ───── POST /api/mod-tags ───── */
  fastify.post('/api/mod-tags', async (req, reply) => {
    try {
      const data = ModTagSchema.parse(req.body)

      const created = await prisma.modTag.create({
        data,
        include: { mod: true, tag: true }
      })

      reply.code(201).send({ success: true, data: created })
    } catch (err) {
      reply.status(400).send({ error: 'Ошибка создания связи ModTag', details: err })
    }
  })

  /* ───── DELETE /api/mod-tags/:modId/:tagId ───── */
  fastify.delete<{ Params: { modId: string; tagId: string } }>(
    '/api/mod-tags/:modId/:tagId',
    async (req, reply) => {
      const { modId, tagId } = req.params

      try {
        await prisma.modTag.delete({
          where: { modId_tagId: { modId, tagId } }
        })
        reply.send({ success: true })
      } catch {
        reply.status(404).send({ error: 'Связь ModTag не найдена' })
      }
    }
  )
}

export default modTagRoutes
