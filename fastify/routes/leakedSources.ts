import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import prisma from '../prisma/client'

// Схемы валидации
const LeakedSourceCreateSchema = z.object({
  modId: z.string().uuid(),
  platform: z.string().min(1),
  originalUrl: z.string().url(),
  downloadUrl: z.string().url(),
  note: z.string().optional(),
})

const LeakedSourceUpdateSchema = z.object({
  platform: z.string().optional(),
  originalUrl: z.string().url().optional(),
  downloadUrl: z.string().url().optional(),
  note: z.string().optional(),
})

export default async function leakedSourceRoutes(fastify: FastifyInstance) {
  // GET /leaked-sources (список с сортировкой, фильтрацией, пагинацией)
  fastify.get<{
    Querystring: {
      sort?: string
      range?: string
      filter?: string
    }
  }>('/leaked-sources', async (req, reply) => {
    const sortSchema = z.tuple([z.string(), z.enum(['ASC', 'DESC'])])
    const rangeSchema = z.tuple([z.number(), z.number()])
    const filterSchema = z.record(z.string(), z.any()).optional()

    try {
      const sort = sortSchema.parse(JSON.parse(req.query.sort ?? '["leakedAt", "DESC"]'))
      const range = rangeSchema.parse(JSON.parse(req.query.range ?? '[0, 24]'))
      const filter = filterSchema.parse(JSON.parse(req.query.filter ?? '{}'))

      const [sortField, sortOrder] = sort
      const [start, end] = range
      const take = end - start + 1

      const where = Object.entries(filter).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? { in: value } : value
        return acc
      }, {} as Record<string, any>)

      const [data, total] = await Promise.all([
        prisma.leakedSource.findMany({
          where: Object.keys(where).length ? where : undefined,
          include: { mod: true },
          skip: start,
          take,
          orderBy: { [sortField]: sortOrder.toLowerCase() },
        }),
        prisma.leakedSource.count({
          where: Object.keys(where).length ? where : undefined,
        }),
      ])

      reply
        .header('Access-Control-Expose-Headers', 'Content-Range')
        .header('Content-Range', `leaked-sources ${start}-${start + data.length - 1}/${total}`)
        .send(data)
    } catch (err) {
      console.error('Ошибка при получении утечек:', err)
      reply.status(400).send({ error: 'Некорректные параметры запроса' })
    }
  })

  // GET /leaked-sources/:id
  fastify.get<{ Params: { id: string } }>('/leaked-sources/:id', async (req, reply) => {
    const { id } = req.params

    const item = await prisma.leakedSource.findUnique({
      where: { id },
      include: { mod: true }
    })

    if (!item) return reply.status(404).send({ error: 'Not found' })

    reply.send({ ...item, id: item.id })
  })

  // POST /leaked-sources
  fastify.post('/leaked-sources', async (req, reply) => {
    try {
      const body = LeakedSourceCreateSchema.parse(req.body)

      const created = await prisma.leakedSource.create({
        data: body,
        include: { mod: true }
      })

      reply.code(201).send({ ...created, id: created.id })
    } catch (err) {
      reply.status(400).send({ error: 'Validation error', details: err })
    }
  })

  // PUT /leaked-sources/:id
  fastify.put<{ Params: { id: string } }>('/leaked-sources/:id', async (req, reply) => {
    const { id } = req.params

    try {
      const body = LeakedSourceUpdateSchema.parse(req.body)

      const updated = await prisma.leakedSource.update({
        where: { id },
        data: body,
        include: { mod: true }
      })

      reply.send({ ...updated, id: updated.id })
    } catch (err) {
      reply.status(400).send({ error: 'Update failed', details: err })
    }
  })

  // DELETE /leaked-sources/:id
  fastify.delete<{ Params: { id: string } }>('/leaked-sources/:id', async (req, reply) => {
    const { id } = req.params

    try {
      await prisma.leakedSource.delete({ where: { id } })
      reply.send({ id })
    } catch {
      reply.status(404).send({ error: 'Not found' })
    }
  })
}
