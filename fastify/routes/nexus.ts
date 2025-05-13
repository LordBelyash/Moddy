// routes/nexus.ts
import { FastifyInstance } from 'fastify'
import { fetchModInfo } from '../services/nexusParser'

export default async function nexusRoutes(fastify: FastifyInstance) {
  fastify.get('/nexus/fetch-mod', async (req, reply) => {
    const { game, modId } = req.query as { game: string; modId: string }

    if (!game || !modId) return reply.status(400).send({ error: 'Missing game or modId' })

    try {
      const data = await fetchModInfo(game, parseInt(modId))
      reply.send(data)
    } catch (err) {
      reply.status(500).send({ error: 'Failed to fetch mod', details: err.message })
    }
  })
}
