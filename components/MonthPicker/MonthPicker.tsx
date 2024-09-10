'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'
import { getAllBalances, getMonthlyBalances } from '@/app/api/actions'

const months = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

type Balance = {
  amount: number
  createdAt: Date
  description: string
  user: string
}

type BalancesResults = {
  groupedBalances: Record<string, Balance[]>
  totals: Record<string, number>
}

export default function MonthPicker() {
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  )
  const [balances, setBalances] = useState<BalancesResults | null>(null)

  const processBalances = (
    results: Record<string, Balance[]>,
  ): BalancesResults => {
    const totals: Record<string, number> = {}

    for (const [employeeName, adjustments] of Object.entries(results)) {
      totals[employeeName] = adjustments.reduce(
        (sum, adjustment) => sum + adjustment.amount,
        0,
      )
    }

    return { groupedBalances: results, totals }
  }

  const loadAllBalances = async () => {
    try {
      const results: Record<string, Balance[]> = await getAllBalances()

      const processedResults = processBalances(results)
      setBalances(processedResults)
    } catch (error) {
      console.error('Erro ao carregar os balances:', error)
    }
  }

  useEffect(() => {
    loadAllBalances()
  }, [])

  const handleSearch = async () => {
    if (selectedMonth && selectedYear) {
      try {
        const results: BalancesResults = await getMonthlyBalances(
          parseInt(selectedYear),
          parseInt(selectedMonth),
        )

        setBalances(results)
      } catch (error) {
        console.error('Erro ao buscar balances mensais:', error)
      }
    } else {
      loadAllBalances()
    }
  }

  // Função para converter minutos em horas e minutos
  function convertMinutesToHoursAndMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}min`
  }

  return (
    <div className="p-2">
      <div className="flex justify-center gap-4">
        <Select onValueChange={(value) => setSelectedMonth(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Mês</SelectLabel>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSelectedYear(value)}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Ano</SelectLabel>
              {Array.from(new Array(100), (_, i) =>
                (new Date().getFullYear() - i).toString(),
              ).map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <button
          onClick={handleSearch}
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Buscar
        </button>
      </div>

      {balances && (
        <div className="mt-4">
          {Object.entries(balances.groupedBalances).map(
            ([employeeName, adjustments], index) => (
              <div key={index} className="mb-6">
                <h2 className="mb-2 text-xl font-bold">{employeeName}</h2>
                <div className="grid grid-cols-5 gap-1 sm:gap-4">
                  <div className="flex justify-center font-semibold">
                    Hora Extra
                  </div>
                  <div className="flex justify-center font-semibold">
                    Hora devedora
                  </div>
                  <div className="flex justify-center font-semibold">
                    Data do lançamento
                  </div>
                  <div className="flex justify-center font-semibold">
                    Motivo
                  </div>
                  <div className="flex justify-center font-semibold">
                    Lançado por:
                  </div>
                </div>
                {adjustments.map((adjustment, i) => {
                  const amountInHours = Math.floor(adjustment.amount / 60)
                  const remainingMinutes = adjustment.amount % 60
                  console.log(
                    'amountInHours:',
                    amountInHours,
                    'remainingMinutes:',
                    remainingMinutes,
                  )
                  return (
                    <div
                      key={i}
                      className={`grid grid-cols-5 ${
                        i % 2 === 0 ? 'bg-gray-100' : 'border bg-white'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center gap-2 text-lg font-medium text-blue-700 sm:flex-row">
                        {adjustment.amount > 0 && (
                          <>
                            {adjustment.amount} Min.
                            <span>
                              ({amountInHours}h {remainingMinutes}min)
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center gap-2 text-lg font-medium text-red-700 sm:flex-row">
                        {adjustment.amount < 0 && (
                          <>
                            {adjustment.amount} Min.
                            <span>
                              ({amountInHours}h {remainingMinutes}min)
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex justify-center text-xs sm:text-base">
                        {new Date(adjustment.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex-wrap">{adjustment.description}</div>
                      <div className="flex justify-center">
                        {adjustment.user}
                      </div>
                    </div>
                  )
                })}
                <div className="mt-2 grid grid-cols-5 font-bold">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div
                    className={`flex flex-col items-center justify-center gap-3 px-1 py-1 font-bold sm:flex-row ${
                      balances.totals[employeeName] >= 0
                        ? 'bg-blue-300'
                        : 'bg-red-300'
                    }`}
                  >
                    <p className="flex text-xl font-semibold">Total:</p>
                    {/*     <p>{balances.totals[employeeName]} Min.</p> */}
                    <p>
                      {convertMinutesToHoursAndMinutes(
                        balances.totals[employeeName],
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}
