'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface Employee {
  id: number
  name: string
  status: boolean
  role?: string | null
  createdAt: Date
  deletedAt: Date | null
}

interface Adjustment {
  amount: number
  date: Date
  description: string | null
  employee: {
    id: number
    name: string
    status: boolean
    role: string | null
    createdAt: Date
    deletedAt: Date | null
  }
  user: {
    id: number
    name: string | null // Atualizado para permitir 'null'
    password: string
    isMaster: boolean
  }
}

export async function authTransaction(password: string) {
  const user = await prisma.user.findFirst({
    where: { password },
  })

  if (user) {
    return user
  }

  return null
}

export async function resetPassword(
  masterPassword: string,
  newPassword: string,
) {
  const masterUser = await prisma.user.findFirst({
    where: { isMaster: true, password: masterPassword },
  })

  if (masterUser) {
    await prisma.user.updateMany({
      where: { isMaster: false },
      data: { password: newPassword },
    })

    return true
  }

  return false
}

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
    revalidatePath('/')
    return response
  } catch (error) {
    console.error('Erro ao criar funcionário no Prisma:', error)
    throw error
  }
}

export async function getAllEmployees() {
  const result = await prisma.employee.findMany({
    where: {
      deletedAt: null,
    },
  })
  return result
}

export async function deleteEmployee(employeeId: number) {
  await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      deletedAt: new Date(),
    },
  })
  revalidatePath('/')
}

export async function addAdjustment(
  employeeId: number,
  amount: number,
  description?: string,
  userId?: number,
) {
  const adjustment = await prisma.adjustment.create({
    data: {
      employeeId,
      amount,
      description,
      userId,
    },
  })
  return adjustment
}

export async function getAllBalances() {
  const adjustments: Adjustment[] = await prisma.adjustment.findMany({
    include: {
      employee: true,
      user: true,
    },
  })

  const groupedBalances = adjustments.reduce(
    (
      acc: Record<
        string,
        Array<{
          amount: number
          createdAt: Date
          description: string
          user: string
        }>
      >,
      adjustment,
    ) => {
      const { employee, amount, date, description, user } = adjustment

      if (!acc[employee.name]) {
        acc[employee.name] = []
      }

      acc[employee.name].push({
        amount,
        createdAt: date,
        description: description || '',
        user: user.name || 'Usuário desconhecido',
      })

      return acc
    },
    {} as Record<
      string,
      Array<{
        amount: number
        createdAt: Date
        description: string
        user: string
      }>
    >,
  )

  return groupedBalances
}

export async function getMonthlyBalances(year: number, month: number) {
  const adjustments: Adjustment[] = await prisma.adjustment.findMany({
    where: {
      date: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
    include: {
      employee: true,
      user: true,
    },
  })

  const groupedBalances = adjustments.reduce(
    (
      acc: Record<
        string,
        Array<{
          amount: number
          createdAt: Date
          description: string
          user: string
        }>
      >,
      adjustment,
    ) => {
      const { employee, amount, date, description, user } = adjustment

      if (!acc[employee.name]) {
        acc[employee.name] = []
      }

      acc[employee.name].push({
        amount,
        createdAt: date,
        description: description || '',
        user: user.name || 'Usuário desconhecido',
      })

      return acc
    },
    {} as Record<
      string,
      Array<{
        amount: number
        createdAt: Date
        description: string
        user: string
      }>
    >,
  )

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

export async function getEmployeeTotalBalance(employeeId: number) {
  const adjustments = await prisma.adjustment.findMany({
    where: {
      employeeId,
    },
  })

  const totalBalance = adjustments.reduce((sum, adjustment) => {
    return sum + adjustment.amount
  }, 0)

  return totalBalance
}
