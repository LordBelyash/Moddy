// src/routes/games.ts
import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import prisma from '../prisma/client'

const gamesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: {
      sort?: string
      range?: string
      filter?: string
    }
  }>('/games', async (req, reply) => {
    // 1) Схемы для sort, range, filter
    const sortSchema = z.tuple([z.string(), z.enum(['ASC', 'DESC'])])
    const rangeSchema = z.tuple([z.number(), z.number()])
    const filterSchema = z.record(z.string(), z.any()).optional()

    try {
      // 2) Парсим входящие параметры (или ставим дефолт)
      const sort       = sortSchema.parse(JSON.parse(req.query.sort ?? '["name","ASC"]'))
      const range      = rangeSchema.parse(JSON.parse(req.query.range ?? '[0,24]'))
      const filterObj  = filterSchema.parse(JSON.parse(req.query.filter ?? '{}'))

      const [sortField, sortOrder] = sort
      const [start, end]           = range
      const take                   = end - start + 1

      // 3) Одновременно получаем нужную страницу и общее число записей
      const [games, total] = await Promise.all([
        prisma.game.findMany({
          where: Object.keys(filterObj).length ? filterObj : undefined,
          orderBy: { [sortField]: sortOrder.toLowerCase() },
          skip: start,
          take,
        }),
        prisma.game.count({
          where: Object.keys(filterObj).length ? filterObj : undefined,
        }),
      ])

      // 4) Отдаём массив игр и заголовок Content-Range
      reply
        .header('Access-Control-Expose-Headers', 'Content-Range')
        .header('Content-Range', `games ${start}-${start + games.length - 1}/${total}`)
        .send(games)
    } catch (err) {
      console.error('Error in GET /games:', err)
      reply.status(400).send({ error: 'Invalid query parameters' })
    }
  })

  // Оставляем остальные endpoints, если нужны: /games/:id, POST, PUT, DELETE
}

export default gamesRoutes
