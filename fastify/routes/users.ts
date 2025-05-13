import { FastifyPluginAsync } from 'fastify'
import prisma from '../prisma/client'
import { z } from 'zod'

const usersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: {
      sort?: string
      range?: string
      filter?: string
    }
  }>('/users', async (req, reply) => {
    try {
      const sortSchema = z.tuple([z.string(), z.enum(['ASC', 'DESC'])])
      const rangeSchema = z.tuple([z.number(), z.number()])
      const filterSchema = z.record(z.string(), z.any()).optional()

      const sort = sortSchema.parse(JSON.parse(req.query.sort ?? '["id", "ASC"]'))
      const range = rangeSchema.parse(JSON.parse(req.query.range ?? '[0, 9]'))
      const filter = filterSchema.parse(JSON.parse(req.query.filter ?? '{}'))

      const [sortField, sortOrder] = sort
      const [start, end] = range
      const take = end - start + 1

      // --- Обработка фильтра, особенно filter.id: []
      const where = filter.id
        ? { id: { in: filter.id } }
        : Object.keys(filter).length > 0 ? filter : undefined

      const users = await prisma.user.findMany({
        where,
        orderBy: { [sortField]: sortOrder.toLowerCase() },
        skip: start,
        take,
        select: {
          id: true,
          email: true,
          username: true,
          avatarUrl: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      const total = await prisma.user.count({ where })

      reply
        .header('Access-Control-Expose-Headers', 'Content-Range')
        .header('Content-Range', `users ${start}-${start + users.length - 1}/${total}`)
        .send(users)
    } catch (err) {
      console.error('Ошибка при получении пользователей:', err)
      reply.status(400).send({ success: false, error: 'Некорректные параметры запроса' })
    }
  })
}

export default usersRoutes
