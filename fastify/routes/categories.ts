// src/routes/categories.ts
import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import prisma from '../prisma/client'

const categoriesRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /categories?sort=["name","ASC"]&range=[0,24]&filter={"name":"foo"}
  fastify.get<{
    Querystring: { sort?: string; range?: string; filter?: string }
  }>('/categories', async (req, reply) => {
    // 1) Схемы для sort, range и filter
    const sortSchema = z.tuple([z.string(), z.enum(['ASC', 'DESC'])])
    const rangeSchema = z.tuple([z.number(), z.number()])
    const filterSchema = z.record(z.string(), z.any()).optional()

    try {
      // 2) Парсим параметры, либо ставим дефолты
      const sort      = sortSchema.parse(JSON.parse(req.query.sort  ?? '["name","ASC"]'))
      const range     = rangeSchema.parse(JSON.parse(req.query.range ?? '[0,24]'))
      const filterObj = filterSchema.parse(JSON.parse(req.query.filter ?? '{}'))

      const [sortField, sortOrder] = sort
      const [start, end]           = range
      const take                   = end - start + 1

      // 3) Запрос к БД: данные + общее число
      const [items, total] = await Promise.all([
        prisma.category.findMany({
          where: Object.keys(filterObj).length ? filterObj : undefined,
          orderBy: { [sortField]: sortOrder.toLowerCase() },
          skip: start,
          take,
        }),
        prisma.category.count({
          where: Object.keys(filterObj).length ? filterObj : undefined,
        }),
      ])

      // 4) Отдаём массив и заголовок Content-Range
      reply
        .header('Access-Control-Expose-Headers', 'Content-Range')
        .header('Content-Range', `categories ${start}-${start + items.length - 1}/${total}`)
        .send(items)
    } catch (err) {
      console.error('GET /categories error:', err)
      reply.status(400).send({ error: 'Invalid query parameters' })
    }
  })

  // GET /categories/:id
  fastify.get<{ Params: { id: string } }>('/categories/:id', async (req, reply) => {
    const { id } = req.params
    const item = await prisma.category.findUnique({ where: { id } })
    if (!item) {
      return reply.status(404).send({ error: 'Category not found' })
    }
    return reply.send(item)
  })

  // POST /categories
  fastify.post('/categories', async (req, reply) => {
    // Зод-валидатор
    const CategorySchema = z.object({
      name: z.string().min(1, 'Name is required'),
      slug: z.string().min(1, 'Slug is required'),
    })
    try {
      const data = CategorySchema.parse(req.body)
      const created = await prisma.category.create({ data })
      return reply.code(201).send(created)
    } catch (err) {
      console.error('POST /categories error:', err)
      return reply.status(400).send({ error: 'Invalid input', details: err })
    }
  })

  // PUT /categories/:id
  fastify.put<{ Params: { id: string } }>('/categories/:id', async (req, reply) => {
    const { id } = req.params
    const CategorySchema = z.object({
      name: z.string().min(1, 'Name is required'),
      slug: z.string().min(1, 'Slug is required'),
    })
    try {
      const data = CategorySchema.parse(req.body)
      const updated = await prisma.category.update({ where: { id }, data })
      return reply.send(updated)
    } catch (err) {
      console.error('PUT /categories/:id error:', err)
      return reply.status(400).send({ error: 'Invalid input or not found', details: err })
    }
  })

  // DELETE /categories/:id
  fastify.delete<{ Params: { id: string } }>('/categories/:id', async (req, reply) => {
    const { id } = req.params
    try {
      await prisma.category.delete({ where: { id } })
      return reply.send({}) // React Admin не использует тело ответа на DELETE
    } catch (err) {
      console.error('DELETE /categories/:id error:', err)
      return reply.status(404).send({ error: 'Category not found' })
    }
  })
}

export default categoriesRoutes
