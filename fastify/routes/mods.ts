import { FastifyPluginAsync } from 'fastify'
import prisma from '../prisma/client'
import { z } from 'zod'

const modIncludes = {
  game: true,
  category: true,
  author: true,
  tags: { include: { tag: true } },
  versions: true,
  leakedInfo: true,
  comments: true,
  downloads: true,
  _count: {
    select: {
      comments: true,
      downloads: true,
    },
  },
}

const modsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: {
      sort?: string
      range?: string
      filter?: string
    }
  }>('/mods', async (req, reply) => {
    const sortSchema = z.tuple([z.string(), z.enum(['ASC', 'DESC'])])
    const rangeSchema = z.tuple([z.number(), z.number()])
    const filterSchema = z.record(z.string(), z.any()).optional()

    try {
      const sort = sortSchema.parse(JSON.parse(req.query.sort ?? '["createdAt", "DESC"]'))
      const range = rangeSchema.parse(JSON.parse(req.query.range ?? '[0, 9]'))
      const filter = filterSchema.parse(JSON.parse(req.query.filter ?? '{}'))

      const [sortField, sortOrder] = sort
      const [start, end] = range
      const take = end - start + 1

      const where = Object.entries(filter).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? { in: value } : value
        return acc
      }, {} as Record<string, any>)

      // Prisma 6+ корректно работает только с orderBy по связям так:
      let orderBy: any

      // Приведение полей сортировки к ожидаемой структуре Prisma
      if (sortField === '_count.downloads') {
        orderBy = { downloads: { _count: sortOrder.toLowerCase() } }
      } else if (sortField === '_count.comments') {
        orderBy = { comments: { _count: sortOrder.toLowerCase() } }
      } else {
        orderBy = { [sortField]: sortOrder.toLowerCase() }
      }
      

      const mods = await prisma.mod.findMany({
        where: Object.keys(where).length ? where : undefined,
        orderBy,
        skip: start,
        take,
        include: modIncludes,
      })

      const total = await prisma.mod.count({
        where: Object.keys(where).length ? where : undefined,
      })

      reply
        .header('Access-Control-Expose-Headers', 'Content-Range')
        .header('Content-Range', `mods ${start}-${start + mods.length - 1}/${total}`)
        .send(mods)
    } catch (err) {
      console.error('Ошибка при получении модов:', err)
      reply.status(400).send({ error: 'Некорректные параметры запроса' })
    }
  })
}

export default modsRoutes
