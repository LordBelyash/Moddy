import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// ───── Валидация через Zod ─────
const BuildCreateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  imageUrl: z.string().url().optional(),
  authorId: z.string().uuid(),
  modIds: z.array(z.string().uuid()).min(1),
})

const BuildUpdateSchema = z.object({
  title: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  modIds: z.array(z.string().uuid()).optional(),
})
// ──────────────────────────────

export default async function buildsRoutes(fastify: FastifyInstance) {
  // ───── GET /api/builds
  fastify.get('/api/builds', async (_req, reply) => {
    const builds = await prisma.build.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        mods: { include: { mod: true } },
        downloads: true,
      },
    })

    reply.send({ success: true, count: builds.length, data: builds })
  })

  // ───── GET /api/builds/:id
  fastify.get('/api/builds/:id', async (req, reply) => {
    const { id } = req.params as { id: string }

    const build = await prisma.build.findUnique({
      where: { id },
      include: {
        author: true,
        mods: { include: { mod: true } },
        downloads: true,
      },
    })

    if (!build) return reply.status(404).send({ error: 'Build not found' })
    reply.send({ success: true, data: build })
  })

  // ───── GET /api/builds/slug/:slug
  fastify.get('/api/builds/slug/:slug', async (req, reply) => {
    const { slug } = req.params as { slug: string }

    const build = await prisma.build.findUnique({
      where: { slug },
      include: {
        author: true,
        mods: { include: { mod: true } },
        downloads: true,
      },
    })

    if (!build) return reply.status(404).send({ error: 'Build not found' })
    reply.send({ success: true, data: build })
  })

  // ───── POST /api/builds
  fastify.post('/api/builds', async (req, reply) => {
    const parse = BuildCreateSchema.safeParse(req.body)

    if (!parse.success) {
      return reply.status(400).send({ error: 'Validation error', issues: parse.error.issues })
    }

    const { title, slug, description, imageUrl, authorId, modIds } = parse.data

    try {
      const build = await prisma.build.create({
        data: {
          title,
          slug,
          description,
          imageUrl,
          authorId,
          mods: {
            create: modIds.map((modId) => ({ modId })),
          },
        },
        include: {
          author: true,
          mods: { include: { mod: true } },
          downloads: true,
        },
      })

      reply.code(201).send({ success: true, data: build })
    } catch {
      reply.status(400).send({ error: 'Failed to create build' })
    }
  })

  // ───── PUT /api/builds/:id
  fastify.put('/api/builds/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const parse = BuildUpdateSchema.safeParse(req.body)

    if (!parse.success) {
      return reply.status(400).send({ error: 'Validation error', issues: parse.error.issues })
    }

    const { modIds, ...rest } = parse.data

    try {
      const updated = await prisma.build.update({
        where: { id },
        data: {
          ...rest,
          mods: modIds
            ? {
                deleteMany: {},
                create: modIds.map((modId) => ({ modId })),
              }
            : undefined,
        },
        include: {
          author: true,
          mods: { include: { mod: true } },
          downloads: true,
        },
      })

      reply.send({ success: true, data: updated })
    } catch {
      reply.status(404).send({ error: 'Build not found or update failed' })
    }
  })

  // ───── DELETE /api/builds/:id
  fastify.delete('/api/builds/:id', async (req, reply) => {
    const { id } = req.params as { id: string }

    try {
      await prisma.build.delete({ where: { id } })
      reply.send({ success: true })
    } catch {
      reply.status(404).send({ error: 'Build not found' })
    }
  })
}
