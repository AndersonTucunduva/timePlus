'use client'

import { Minus, Plus } from 'lucide-react'
import { Input } from '../ui/input'
import { useEffect, useState } from 'react'
import {
  addAdjustment,
  deleteEmployee,
  getEmployeeTotalBalance,
} from '@/app/api/actions'
import { useToast } from '@/components/ui/use-toast'
import { ModalConfirm } from '../ModalConfirm/ModalConfirm'
import { ModalDelete } from '../ModalDelete/ModalDelete'

interface Props {
  employeeId: number
}

export default function ModalAdjustments({ employeeId }: Props) {
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')
  const [isAdding, setIsAdding] = useState<boolean>(true)
  const [totalBalance, setTotalBalance] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchTotalBalance() {
      try {
        const balance = await getEmployeeTotalBalance(employeeId)
        setTotalBalance(balance)
      } catch (error) {
        console.error('Erro ao buscar saldo total:', error)
      }
    }

    fetchTotalBalance()
  }, [employeeId])

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    let inputValue = event.target.value.replace(/\D/g, '') // Remove tudo que não é número

    // Limita a quantidade máxima de caracteres para evitar entradas inválidas
    if (inputValue.length > 4) {
      inputValue = inputValue.slice(0, 4)
    }

    // Formata o valor para o formato de horas (HH:MM)
    if (inputValue.length >= 3) {
      inputValue = `${inputValue.slice(0, -2)}:${inputValue.slice(-2)}`
    }

    setValue(inputValue)
  }

  // Função para converter o valor em minutos
  function convertTimeToMinutes(time: string) {
    const [hours, minutes] = time.split(':').map(Number)

    if (!isNaN(hours) && !isNaN(minutes)) {
      return hours * 60 + minutes
    }
    return null // Retorna nulo se a entrada for inválida
  }

  function handleBlur() {
    const totalMinutes = convertTimeToMinutes(value)
    if (totalMinutes !== null) {
      console.log('Total em minutos:', totalMinutes)
    } else {
      console.error('Formato inválido')
    }
  }

  function handleChangeDescription(event: React.ChangeEvent<HTMLInputElement>) {
    setDescription(event.target.value)
  }

  function convertMinutesToTimeFormat(minutes: number) {
    const sign = minutes < 0 ? '-' : ''
    const absoluteMinutes = Math.abs(minutes)
    const hours = Math.floor(absoluteMinutes / 60)
    const remainingMinutes = absoluteMinutes % 60
    return `${sign}${hours}h ${remainingMinutes}min`
  }

  async function handleSaveAdjustments(userId: number) {
    try {
      const adjustedMinutes = convertTimeToMinutes(value)

      if (adjustedMinutes === null) {
        throw new Error('Formato de tempo inválido. Use HH:MM.')
      }

      const finalValue = isAdding ? adjustedMinutes : -adjustedMinutes

      await addAdjustment(employeeId, finalValue, description, userId)

      setValue('')
      setDescription('')

      toast({
        variant: 'default',
        description: 'Hora adicionada com sucesso!',
        duration: 1000,
      })

      const updatedBalance = await getEmployeeTotalBalance(employeeId)
      setTotalBalance(updatedBalance)
    } catch (error) {
      console.error('Erro ao salvar ajuste:', error)
      toast({
        variant: 'destructive',
        description: 'Erro ao salvar o ajuste de horas.',
      })
    }
  }

  async function handleDelete() {
    try {
      await deleteEmployee(employeeId)

      toast({
        variant: 'destructive',
        description: 'Funcionário excluído com sucesso!',
        duration: 1000,
      })
    } catch (error) {
      console.error('Erro ao salvar ajuste:', error)
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col justify-center border-b-2 pb-4">
        <p className="flex justify-center text-lg font-medium">
          Total de Horas:
        </p>
        <p
          className={`flex justify-center rounded-full text-xl font-bold md:p-2 ${
            totalBalance !== null
              ? totalBalance >= 0
                ? 'bg-blue-600 text-white'
                : 'bg-red-600 text-white'
              : ''
          }`}
        >
          {totalBalance !== null
            ? `${convertMinutesToTimeFormat(totalBalance)}`
            : 'Carregando...'}
        </p>
      </div>
      <div className="mb-2 flex justify-center">
        <button
          onClick={() => setIsAdding(true)}
          className={`mr-4 flex items-center rounded-lg p-2 ${isAdding ? 'bg-blue-500 ring-1 ring-black' : 'bg-gray-400'} text-white`}
        >
          <Plus className="mr-1" />
          Extra
        </button>
        <button
          onClick={() => setIsAdding(false)}
          className={`flex items-center rounded-lg p-2 ${!isAdding ? 'bg-red-500 ring-1 ring-black' : 'bg-gray-400'} text-white`}
        >
          <Minus className="mr-1" />
          Falta
        </button>
      </div>
      <div className="mt-3 flex max-w-48 items-center md:mt-4">
        <div className="mr-2 h-7 w-7">
          {isAdding ? <Plus className="mr-2" /> : <Minus className="mr-2" />}
        </div>
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="HH:MM"
          maxLength={5}
        />

        <p className="ml-4">Horas</p>
      </div>
      <div className="mt-4">
        <Input
          placeholder="Descrição (Opcional)"
          value={description}
          onChange={handleChangeDescription}
        />
      </div>
      <div className="flex gap-1">
        <ModalDelete handleDelete={handleDelete} />
        <ModalConfirm handleSaveAdjustments={handleSaveAdjustments} />
      </div>
    </div>
  )
}
