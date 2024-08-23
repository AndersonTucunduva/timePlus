'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function newEmployee(
  name: string,
  role: string | null,
): Promise<{
  id: number
  name: string
  status: boolean
  role: string | null
  createdAt: Date
  deletedAt: Date | null
}> {
  try {
    const response = await prisma.employee.create({
      data: {
        name,
        role,
      },
    })
    return response
  } catch (error) {
    console.error('Erro ao criar funcionário no Prisma:', error)
    throw error
  }
}

export async function getAllEmployees() {
  const result = await prisma.employee.findMany()
  return result
}

export async function addAdjustment(
  employeeId: number,
  amount: number,
  description?: string,
) {
  const adjustment = await prisma.adjustment.create({
    data: {
      employeeId,
      amount,
      description,
    },
  })
  return adjustment
}

export async function getMonthlyBalances(year: number, month: number) {
  const adjustments = await prisma.adjustment.findMany({
    where: {
      date: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
  })

  const balances = adjustments.reduce(
    (acc, adjustment) => {
      const { employeeId, amount } = adjustment
      if (!acc[employeeId]) {
        acc[employeeId] = 0
      }
      acc[employeeId] += amount
      return acc
    },
    {} as Record<number, number>,
  )

  return balances
}
