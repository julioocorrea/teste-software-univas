import { Request, Response } from 'express'
import { prisma } from '../index'
import { z } from 'zod'

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format')
})

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional()
})

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        tasks: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      success: true,
      count: users.length,
      data: users
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    })
  }
}

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            category: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    })
  }
}

// Create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body)

    const user = await prisma.user.create({
      data: validatedData,
      include: {
        tasks: true
      }
    })

    res.status(201).json({
      success: true,
      data: user
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      })
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      })
    }

    console.error('Error creating user:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    })
  }
}

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const validatedData = updateUserSchema.parse(req.body)

    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
      include: {
        tasks: true
      }
    })

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      })
    }

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    console.error('Error updating user:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    })
  }
}

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.user.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    console.error('Error deleting user:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    })
  }
}
