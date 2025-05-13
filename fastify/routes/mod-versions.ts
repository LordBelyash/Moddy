import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import prisma from '../prisma/client'

// Схемы валидации
const ModVersionCreateSchema = z.object({
  version: z.string().min(1),
  changelog: z.string().optional(),
  fileUrl: z.string().url(),
  fileSize: z.number().int().positive().optional(),
  modId: z.string().uuid()
})

const ModVersionUpdateSchema = z.object({
  version: z.string().optional(),
  changelog: z.string().optional(),
  fileUrl: z.string().url().optional(),
  fileSize: z.number().int().positive().optional()
})

export default async function modVersionRoutes(fastify: FastifyInstance) {
  // GET /mod-versions (список с фильтрацией, сортировкой, пагинацией)
  fastify.get<{
    Querystring: {
      sort?: string
      range?: string
      filter?: string
    }
  }>('/mod-versions', async (req, reply) => {
    const sortSchema = z.tuple([z.string(), z.enum(['ASC', 'DESC'])])
    const rangeSchema = z.tuple([z.number(), z.number()])
    const filterSchema = z.record(z.string(), z.any()).optional()

    try {
      const sort = sortSchema.parse(JSON.parse(req.query.sort ?? '["createdAt", "DESC"]'))
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
        prisma.modVersion.findMany({
          where: Object.keys(where).length ? where : undefined,
          include: { mod: true },
          skip: start,
          take,
          orderBy: { [sortField]: sortOrder.toLowerCase() },
        }),
        prisma.modVersion.count({
          where: Object.keys(where).length ? where : undefined,
        }),
      ])

      reply
        .header('Access-Control-Expose-Headers', 'Content-Range')
        .header('Content-Range', `mod-versions ${start}-${start + data.length - 1}/${total}`)
        .send(data)
    } catch (err) {
      console.error('Ошибка при получении версий модов:', err)
      reply.status(400).send({ error: 'Некорректные параметры запроса' })
    }
  })

  // GET /mod-versions/:id
  fastify.get<{ Params: { id: string } }>('/mod-versions/:id', async (req, reply) => {
    const { id } = req.params

    const item = await prisma.modVersion.findUnique({
      where: { id },
      include: { mod: true }
    })

    if (!item) return reply.status(404).send({ error: 'Not found' })

    reply.send({ ...item, id: item.id })
  })

  // POST /mod-versions
  fastify.post('/mod-versions', async (req, reply) => {
    try {
      const body = ModVersionCreateSchema.parse(req.body)

      const created = await prisma.modVersion.create({
        data: body,
        include: { mod: true }
      })

      reply.code(201).send({ ...created, id: created.id })
    } catch (err) {
      reply.status(400).send({ error: 'Validation error', details: err })
    }
  })

  // PUT /mod-versions/:id
  fastify.put<{ Params: { id: string } }>('/mod-versions/:id', async (req, reply) => {
    const { id } = req.params

    try {
      const body = ModVersionUpdateSchema.parse(req.body)

      const updated = await prisma.modVersion.update({
        where: { id },
        data: body,
        include: { mod: true }
      })

      reply.send({ ...updated, id: updated.id })
    } catch (err) {
      reply.status(400).send({ error: 'Update failed', details: err })
    }
  })

  // DELETE /mod-versions/:id
  fastify.delete<{ Params: { id: string } }>('/mod-versions/:id', async (req, reply) => {
    const { id } = req.params

    try {
      await prisma.modVersion.delete({ where: { id } })
      reply.send({ id })
    } catch {
      reply.status(404).send({ error: 'Not found' })
    }
  })
}
