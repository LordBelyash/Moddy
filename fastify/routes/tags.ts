import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import prisma from '../prisma/client'

// 🔹 Валидация с помощью Zod
const TagCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
})

const TagUpdateSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
})

export default async function tagsRoutes(fastify: FastifyInstance) {
  // 🔹 GET /tags?filter&sort&range — список
  fastify.get<{
    Querystring: {
      sort?: string
      range?: string
      filter?: string
    }
  }>('/tags', async (req, reply) => {
    try {
      const sort = JSON.parse(req.query.sort ?? '["name","ASC"]')
      const range = JSON.parse(req.query.range ?? '[0, 24]')
      const filter = JSON.parse(req.query.filter ?? '{}')

      const [sortField, sortOrder] = sort
      const [start, end] = range
      const take = end - start + 1

      const where = Object.entries(filter).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? { in: value } : { contains: value }
        return acc
      }, {} as Record<string, any>)

      const [data, total] = await Promise.all([
        prisma.tag.findMany({
          where,
          skip: start,
          take,
          orderBy: {
            [sortField]: sortOrder.toLowerCase(),
          },
        }),
        prisma.tag.count({ where }),
      ])

      reply
        .header('Access-Control-Expose-Headers', 'Content-Range')
        .header('Content-Range', `tags ${start}-${start + data.length - 1}/${total}`)
        .send(data)
    } catch (err) {
      console.error('Ошибка получения списка тегов:', err)
      reply.status(400).send({ error: 'Неверные параметры' })
    }
  })

  // 🔹 GET /tags/:id
  fastify.get<{ Params: { id: string } }>('/tags/:id', async (req, reply) => {
    const tag = await prisma.tag.findUnique({ where: { id: req.params.id } })
    if (!tag) return reply.status(404).send({ error: 'Тег не найден' })
    reply.send(tag)
  })

  // 🔹 POST /tags
  fastify.post<{ Body: z.infer<typeof TagCreateSchema> }>('/tags', async (req, reply) => {
    try {
      const data = TagCreateSchema.parse(req.body)
      const created = await prisma.tag.create({ data })
      reply.code(201).send(created)
    } catch (err) {
      reply.status(400).send({ error: 'Ошибка валидации', details: err })
    }
  })

  // 🔹 PUT /tags/:id
  fastify.put<{ Params: { id: string }, Body: z.infer<typeof TagUpdateSchema> }>('/tags/:id', async (req, reply) => {
    try {
      const data = TagUpdateSchema.parse(req.body)
      const updated = await prisma.tag.update({
        where: { id: req.params.id },
        data,
      })
      reply.send(updated)
    } catch (err) {
      reply.status(404).send({ error: 'Не удалось обновить тег', details: err })
    }
  })

  // 🔹 DELETE /tags/:id
  fastify.delete<{ Params: { id: string } }>('/tags/:id', async (req, reply) => {
    try {
      await prisma.tag.delete({ where: { id: req.params.id } })
      reply.send({ id: req.params.id })
    } catch {
      reply.status(404).send({ error: 'Не удалось удалить тег' })
    }
  })
}
