import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const workCategory = await prisma.category.upsert({
    where: { name: 'Work' },
    update: {},
    create: {
      name: 'Work',
      description: 'Tasks related to work and professional activities'
    }
  })

  const personalCategory = await prisma.category.upsert({
    where: { name: 'Personal' },
    update: {},
    create: {
      name: 'Personal',
      description: 'Personal tasks and activities'
    }
  })

  const studyCategory = await prisma.category.upsert({
    where: { name: 'Study' },
    update: {},
    create: {
      name: 'Study',
      description: 'Educational and learning tasks'
    }
  })

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    }
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    }
  })

  // Create tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Complete project proposal',
        description: 'Write and submit the quarterly project proposal',
        status: 'PENDING',
        priority: 'HIGH',
        userId: user1.id,
        categoryId: workCategory.id
      },
      {
        title: 'Review team performance',
        description: 'Analyze team metrics and prepare performance review',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        userId: user1.id,
        categoryId: workCategory.id
      },
      {
        title: 'Learn TypeScript',
        description: 'Complete online TypeScript course',
        status: 'PENDING',
        priority: 'MEDIUM',
        userId: user2.id,
        categoryId: studyCategory.id
      },
      {
        title: 'Plan weekend trip',
        description: 'Research destinations and book accommodation',
        status: 'COMPLETED',
        priority: 'LOW',
        userId: user2.id,
        categoryId: personalCategory.id
      },
      {
        title: 'Update resume',
        description: 'Add recent projects and skills to resume',
        status: 'PENDING',
        priority: 'HIGH',
        userId: user1.id,
        categoryId: personalCategory.id
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
