import Fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'

dotenv.config()

// ─── Импорты маршрутов ───
import gameRoutes from './routes/game'
import categoriesRoutes from './routes/categories'
import tagsRoutes from './routes/tags'
import usersRoutes from './routes/users'
import modsRoutes from './routes/mods'
import modVersionRoutes from './routes/mod-versions'
import modTagRoutes from './routes/mod-tags'
import commentRoutes from './routes/comments'
import downloadRoutes from './routes/downloads'
import leakedSourceRoutes from './routes/leakedSources'
import buildsRoutes from './routes/builds' // 👈 добавляем сборки
// ─────────────────────────
import nexusRoutes from './routes/nexus'

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  ignoreTrailingSlash: true,
})

// ───── Разрешаем CORS ─────
await fastify.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = ['http://localhost:3001', 'http://localhost:5173']
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed'), false)
    }
  },
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // 👈 добавь это
  credentials: true,
})
// ──────────────────────────


// ───── Регистрируем маршруты ─────
fastify.register(gameRoutes,         { prefix: '/api' })
fastify.register(categoriesRoutes,   { prefix: '/api' })
fastify.register(tagsRoutes,         { prefix: '/api' })
fastify.register(usersRoutes,        { prefix: '/api' })
fastify.register(modsRoutes,         { prefix: '/api' })
fastify.register(modVersionRoutes,   { prefix: '/api' })
fastify.register(modTagRoutes,       { prefix: '/api' })
fastify.register(commentRoutes,      { prefix: '/api' })
fastify.register(downloadRoutes,     { prefix: '/api' })
fastify.register(leakedSourceRoutes, { prefix: '/api' })
fastify.register(buildsRoutes,       { prefix: '/api' })
fastify.register(nexusRoutes,        { prefix: '/api' }) // 👈 добавлено
// ──────────────────────────────────

// ──────────────────────────────────

// ───── Запуск сервера ─────
const PORT = Number(process.env.PORT) || 3000

try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' })
  console.log(`🚀 Server is running at http://localhost:${PORT}`)
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
// ──────────────────────────

