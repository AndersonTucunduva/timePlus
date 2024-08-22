import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

export async function getMonthlyBalance(
  employeeId: number,
  year: number,
  month: number,
) {
  const adjustments = await prisma.adjustment.findMany({
    where: {
      employeeId,
      date: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
  })

  const balance = adjustments.reduce(
    (total, adjustment) => total + adjustment.amount,
    0,
  )
  return balance
}
