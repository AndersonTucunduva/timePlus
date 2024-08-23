'use client'

import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'
import { getMonthlyBalances } from '@/app/api/route'

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

export default function MonthPicker() {
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  )
  const [balances, setBalances] = useState<{
    groupedBalances: Record<
      string,
      Array<{ amount: number; createdAt: Date; description: string }>
    >
    totals: Record<string, number>
  } | null>(null)

  const handleSearch = async () => {
    if (selectedMonth && selectedYear) {
      const results = await getMonthlyBalances(
        parseInt(selectedYear),
        parseInt(selectedMonth),
      )
      setBalances(results)
    }
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
                  <div className="font-semibold">Hora Extra</div>
                  <div className="font-semibold">Hora devedora </div>
                  <div className="font-semibold">Data de Criação</div>
                  <div className="font-semibold">Descrição</div>
                  <div className="font-semibold">Total</div>
                </div>
                {adjustments.map((adjustment, i) => (
                  <div key={i} className="grid grid-cols-5 gap-1 sm:gap-4">
                    <div className="max-w-14 border-b">
                      {adjustment.amount > 0 ? adjustment.amount : ''}
                    </div>
                    <div className="max-w-14 border-b">
                      {adjustment.amount < 0 ? adjustment.amount : ''}
                    </div>
                    <div className="max-w-40 border-b">
                      {new Date(adjustment.createdAt).toLocaleDateString()}
                    </div>
                    <div className="max-w-52 flex-wrap border-b">
                      {adjustment.description}
                    </div>
                    <div></div>{' '}
                  </div>
                ))}
                <div className="mt-2 grid grid-cols-5 gap-4 font-bold">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="border-b">Total:</div>
                  <div
                    className={`max-w-32 border-b px-4 py-2 ${
                      balances.totals[employeeName] >= 0
                        ? 'bg-blue-300'
                        : 'bg-red-300'
                    }`}
                  >
                    {balances.totals[employeeName]} Minutos
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
