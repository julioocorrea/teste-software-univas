import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb } from './testDb'

describe('Tasks API', () => {
  afterAll(async () => {
    await prisma.$disconnect()
    await appPrisma.$disconnect()
  })

  beforeEach(async () => {
    await resetDb()
  })

  it('POST /api/tasks cria tarefa válida', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'julio',
        email: 'julio@ex.com'
      }
    })
    const category = await prisma.category.create({
      data: {
        name: 'Categoria X'
      }
    })

    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Tarefa 1',
        description: 'Descrição da tarefa 1',
        userId: user.id,
        categoryId: category.id
      })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      title: 'Tarefa 1',
      description: 'Descrição da tarefa 1',
      userId: user.id,
      categoryId: category.id
    })
  })

})
