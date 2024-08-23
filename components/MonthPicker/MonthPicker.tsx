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
  const [balances, setBalances] = useState<Record<number, number> | null>(null)
  console.log('BALANCE:', balances)

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
    <div>
      <div className="flex gap-4">
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
          <h2 className="text-xl font-bold">Saldos do Mês:</h2>
          <ul>
            {Object.entries(balances).map(([employeeId, balance]) => (
              <li key={employeeId}>
                Funcionário {employeeId}: {balance} minutos
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
