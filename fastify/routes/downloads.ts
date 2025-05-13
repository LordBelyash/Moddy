import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import prisma from '../prisma/client'

// ✅ Схема валидации для создания загрузки
const CreateDownloadSchema = z.object({
  userId: z.string().uuid('Неверный UUID пользователя'),
  modId: z.string().uuid('Неверный UUID мода')
})

const downloadRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  /* ───── GET /api/downloads ───── */
  fastify.get('/api/downloads', async (_req, reply) => {
    const downloads = await prisma.download.findMany({
      include: { user: true, mod: true },
      orderBy: { createdAt: 'desc' }
    })

    reply.send({ success: true, count: downloads.length, data: downloads })
  })

  /* ───── GET /api/downloads/:id ───── */
  fastify.get<{ Params: { id: string } }>('/api/downloads/:id', async (req, reply) => {
    const { id } = req.params

    const download = await prisma.download.findUnique({
      where: { id },
      include: { user: true, mod: true }
    })

    if (!download) {
      return reply.status(404).send({ error: 'Загрузка не найдена' })
    }

    reply.send({ success: true, data: download })
  })

  /* ───── POST /api/downloads ───── */
  fastify.post('/api/downloads', async (req, reply) => {
    try {
      const data = CreateDownloadSchema.parse(req.body)

      const created = await prisma.download.create({
        data,
        include: { user: true, mod: true }
      })

      reply.code(201).send({ success: true, data: created })
    } catch (err) {
      reply.status(400).send({ error: 'Ошибка создания загрузки', details: err })
    }
  })

  /* ───── DELETE /api/downloads/:id ───── */
  fastify.delete<{ Params: { id: string } }>('/api/downloads/:id', async (req, reply) => {
    const { id } = req.params

    try {
      await prisma.download.delete({ where: { id } })
      reply.send({ success: true })
    } catch {
      reply.status(404).send({ error: 'Загрузка не найдена' })
    }
  })
}

export default downloadRoutes
