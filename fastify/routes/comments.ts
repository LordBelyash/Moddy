import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import prisma from '../prisma/client'

const CreateCommentSchema = z.object({
  content: z.string().min(1, 'Комментарий не может быть пустым'),
  userId: z.string().uuid('Неверный UUID пользователя'),
  modId: z.string().uuid('Неверный UUID мода')
})

const UpdateCommentSchema = z.object({
  content: z.string().min(1, 'Комментарий не может быть пустым')
})

const commentRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  /* ───── GET /api/comments ───── */
  fastify.get('/api/comments', async (_req, reply) => {
    const comments = await prisma.comment.findMany({
      include: { user: true, mod: true },
      orderBy: { createdAt: 'desc' }
    })
    reply.send({ success: true, count: comments.length, data: comments })
  })

  /* ───── GET /api/comments/:id ───── */
  fastify.get<{ Params: { id: string } }>('/api/comments/:id', async (req, reply) => {
    const { id } = req.params

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { user: true, mod: true }
    })

    if (!comment) {
      return reply.status(404).send({ error: 'Комментарий не найден' })
    }

    reply.send({ success: true, data: comment })
  })

  /* ───── POST /api/comments ───── */
  fastify.post('/api/comments', async (req, reply) => {
    try {
      const data = CreateCommentSchema.parse(req.body)

      const created = await prisma.comment.create({
        data,
        include: { user: true, mod: true }
      })

      reply.code(201).send({ success: true, data: created })
    } catch (err) {
      reply.status(400).send({ error: 'Ошибка при создании комментария', details: err })
    }
  })

  /* ───── PUT /api/comments/:id ───── */
  fastify.put<{ Params: { id: string } }>('/api/comments/:id', async (req, reply) => {
    const { id } = req.params

    try {
      const data = UpdateCommentSchema.parse(req.body)

      const updated = await prisma.comment.update({
        where: { id },
        data,
        include: { user: true, mod: true }
      })

      reply.send({ success: true, data: updated })
    } catch (err) {
      reply.status(400).send({ error: 'Ошибка при обновлении комментария', details: err })
    }
  })

  /* ───── DELETE /api/comments/:id ───── */
  fastify.delete<{ Params: { id: string } }>('/api/comments/:id', async (req, reply) => {
    const { id } = req.params

    try {
      await prisma.comment.delete({ where: { id } })
      reply.send({ success: true })
    } catch {
      reply.status(404).send({ error: 'Комментарий не найден' })
    }
  })
}

export default commentRoutes
