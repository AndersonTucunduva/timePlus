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

/*
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
*/
export async function getMonthlyBalances(year: number, month: number) {
  const adjustments = await prisma.adjustment.findMany({
    where: {
      date: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
    include: {
      employee: true, // Inclui os dados do funcionário
    },
  })

  // Agrupa os ajustes por funcionário
  const groupedBalances = adjustments.reduce(
    (acc, adjustment) => {
      const { employee, amount, date, description } = adjustment

      if (!acc[employee.name]) {
        acc[employee.name] = []
      }

      acc[employee.name].push({
        amount,
        createdAt: date,
        description: description || '', // Garante que a descrição seja uma string
      })

      return acc
    },
    {} as Record<
      string,
      Array<{ amount: number; createdAt: Date; description: string }>
    >,
  )

  // Calcula o total para cada funcionário
  const totals = Object.keys(groupedBalances).reduce(
    (acc, employeeName) => {
      const total = groupedBalances[employeeName].reduce(
        (sum, adjustment) => sum + adjustment.amount,
        0,
      )
      acc[employeeName] = total
      return acc
    },
    {} as Record<string, number>,
  )

  return { groupedBalances, totals }
}
