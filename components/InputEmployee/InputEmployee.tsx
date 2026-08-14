'use client'

import { Check, LoaderCircle, Plus, X } from 'lucide-react'
import { Input } from '../ui/input'
import { useState } from 'react'
import { newEmployee } from '@/app/api/actions'

export default function InputEmployee() {
  const [isNew, setIsNew] = useState(false)
  const [employeeName, setEmployeeName] = useState('')
  const [employeeRole, setEmployeeRole] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handlePlusClick() {
    setIsNew(true)
  }

  async function handleNewEmployee() {
    if (employeeName === '' || isSubmitting) return

    setIsSubmitting(true)
    try {
      await newEmployee(employeeName, employeeRole)
      setIsNew(false)
      setEmployeeName('')
      setEmployeeRole('')
    } catch (error) {
      console.error('Erro ao criar funcionário:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <button
        className="flex h-10 w-14 items-center justify-center rounded-xl bg-green-500 text-white hover:bg-green-600"
        onClick={handlePlusClick}
        disabled={isNew}
        aria-label="Adicionar funcionário"
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
            aria-label="Cancelar criação de funcionário"
            disabled={isSubmitting}
          >
            <X />
          </button>
          <button
            onClick={handleNewEmployee}
            className="flex h-10 items-center justify-center rounded-xl bg-green-500 px-4 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            aria-label="Criar funcionário"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin" />
                <span className="ml-2">Salvando...</span>
              </>
            ) : (
              <Check />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
