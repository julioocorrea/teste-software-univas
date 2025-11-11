import { describe, it, beforeEach, afterAll, expect } from 'vitest'
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
      data: { name: 'julio', email: 'julio@ex.com' }
    })
    const category = await prisma.category.create({
      data: { name: 'Categoria X' }
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

  it('GET /api/tasks retorna todas as tarefas', async () => {
    const user = await prisma.user.create({
      data: { name: 'julio', email: 'julio@ex.com' }
    })
    const category = await prisma.category.create({
      data: { name: 'Categoria X' }
    })

    await prisma.task.createMany({
      data: [
        { title: 'Tarefa 1', userId: user.id, categoryId: category.id },
        { title: 'Tarefa 2', userId: user.id, categoryId: category.id }
      ]
    })

    const res = await request(app).get('/api/tasks')

    expect(res.status).toBe(200)
    expect(res.body.data.length).toBe(2)
    expect(res.body.data[0]).toHaveProperty('title')
  })

  it('GET /api/tasks/:id retorna tarefa específica', async () => {
    const user = await prisma.user.create({
      data: { name: 'julio', email: 'julio@ex.com' }
    })
    const category = await prisma.category.create({
      data: { name: 'Categoria X' }
    })
    const task = await prisma.task.create({
      data: { title: 'Tarefa 1', userId: user.id, categoryId: category.id }
    })

    const res = await request(app).get(`/api/tasks/${task.id}`)

    expect(res.status).toBe(200)
    expect(res.body.data.title).toBe('Tarefa 1')
  })

  it('PUT /api/tasks/:id atualiza uma tarefa existente', async () => {
    const user = await prisma.user.create({
      data: { name: 'julio', email: 'julio@ex.com' }
    })
    const category = await prisma.category.create({
      data: { name: 'Categoria X' }
    })
    const task = await prisma.task.create({
      data: {
        title: 'Tarefa Original',
        description: 'Descrição original',
        userId: user.id,
        categoryId: category.id
      }
    })

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ title: 'Tarefa Atualizada', status: 'COMPLETED' })

    expect(res.status).toBe(200)
    expect(res.body.data.title).toBe('Tarefa Atualizada')
    expect(res.body.data.status).toBe('COMPLETED')
  })

  it('DELETE /api/tasks/:id remove uma tarefa existente', async () => {
    const user = await prisma.user.create({
      data: { name: 'julio', email: 'julio@ex.com' }
    })
    const category = await prisma.category.create({
      data: { name: 'Categoria X' }
    })
    const task = await prisma.task.create({
      data: { title: 'Tarefa para deletar', userId: user.id, categoryId: category.id }
    })

    const res = await request(app).delete(`/api/tasks/${task.id}`)

    expect(res.status).toBe(200)

    const check = await prisma.task.findUnique({ where: { id: task.id } })
    expect(check).toBeNull()
  })
})
