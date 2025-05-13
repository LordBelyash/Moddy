import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  const games = ['Cyberpunk 2077', 'Skyrim', 'Minecraft', 'Stalker']
  const categories = ['Weapons', 'Quests', 'Textures', 'UI']
  const tags = ['4K', 'HD', 'NSFW', 'Survival', 'Story']

  const gameEntities = await Promise.all(
    games.map(name =>
      prisma.game.upsert({
        where: { name },
        update: {},
        create: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
        },
      })
    )
  )

  const categoryEntities = await Promise.all(
    categories.map(name =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
        },
      })
    )
  )

  const tagEntities = await Promise.all(
    tags.map(name =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
        },
      })
    )
  )

  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.username(),
          password: faker.internet.password(),
          avatarUrl: faker.image.avatar(),
          bio: faker.lorem.sentence(),
        },
      })
    )
  )

  const mods = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const author = faker.helpers.arrayElement(users)
      const game = faker.helpers.arrayElement(gameEntities)
      const category = faker.helpers.arrayElement(categoryEntities)
      const selectedTags = faker.helpers.arrayElements(tagEntities, 2)

      const mod = await prisma.mod.create({
        data: {
          title: faker.commerce.productName(),
          slug: faker.lorem.slug(),
          description: faker.lorem.paragraph(),
          version: '1.0.0',
          fileUrl: faker.internet.url(),
          imageUrl: faker.image.urlPicsumPhotos(),
          authorId: author.id,
          gameId: game.id,
          categoryId: category.id,
        },
      })

      await Promise.all(
        selectedTags.map(tag =>
          prisma.modTag.create({
            data: {
              modId: mod.id,
              tagId: tag.id,
            },
          })
        )
      )

      await prisma.modVersion.create({
        data: {
          version: '1.0.0',
          changelog: 'Initial release',
          fileUrl: faker.internet.url(),
          fileSize: faker.number.int({ min: 1000, max: 100000 }),
          modId: mod.id,
        },
      })

      if (faker.datatype.boolean()) {
        await prisma.leakedSource.create({
          data: {
            platform: faker.company.name(),
            originalUrl: faker.internet.url(),
            downloadUrl: faker.internet.url(),
            note: faker.lorem.sentence(),
            modId: mod.id,
          },
        })
      }

      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          userId: author.id,
          modId: mod.id,
        },
      })

      await prisma.download.create({
        data: {
          userId: author.id,
          modId: mod.id,
        },
      })

      return mod
    })
  )

  console.log(`✅ Seed completed: ${users.length} users, ${mods.length} mods`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
