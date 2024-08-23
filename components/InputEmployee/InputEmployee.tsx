'use client'

import { Check, Plus, X } from 'lucide-react'
import { Input } from '../ui/input'
import { useState } from 'react'
import { newEmployee } from '@/app/api/route'

export default function InputEmployee() {
  const [isNew, setIsNew] = useState(false)
  const [employeeName, setEmployeeName] = useState('')
  const [employeeRole, setEmployeeRole] = useState('')

  function handlePlusClick() {
    setIsNew(true)
  }

  async function handleNewEmployee() {
    try {
      const response = await newEmployee(employeeName, employeeRole)
      console.log('RESPONSE:', response)
      setIsNew(false)
      setEmployeeName('')
      setEmployeeRole('')
    } catch (error) {
      console.error('Erro ao criar funcionário:', error)
    }
  }
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        className="flex h-10 w-14 items-center justify-center rounded-xl bg-green-500 text-white hover:bg-green-600"
        onClick={handlePlusClick}
        disabled={isNew}
      >
        <Plus />
      </button>
      <div className="min-w-48">
        <Input
          disabled={!isNew}
          placeholder="Novo funcionário"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
      </div>
      <div className="min-w-48">
        <Input
          disabled={!isNew}
          placeholder="Função"
          value={employeeRole}
          onChange={(e) => setEmployeeRole(e.target.value)}
        />
      </div>
      {isNew && (
        <div className="flex gap-2">
          <button
            className="flex h-10 w-14 items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600"
            onClick={() => setIsNew(false)}
          >
            <X />
          </button>
          <button
            onClick={handleNewEmployee}
            className="flex h-10 w-14 items-center justify-center rounded-xl bg-green-500 text-white hover:bg-green-600"
          >
            <Check />
          </button>
        </div>
      )}
    </div>
  )
}
