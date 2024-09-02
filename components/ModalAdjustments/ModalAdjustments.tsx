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
  const [value, setValue] = useState(0.1)
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
  /*
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value)
  }
*/

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = parseFloat(event.target.value)

    // Verifica se o novo valor é um número válido
    if (!isNaN(newValue)) {
      setValue(newValue)
    } else {
      // Lida com o caso em que o valor não é um número válido
      console.error('Valor inválido:', event.target.value)
    }
  }

  function handleChangeDescription(event: React.ChangeEvent<HTMLInputElement>) {
    setDescription(event.target.value)
  }

  function convertTimeInputToMinutes(timeInput: number) {
    // Converta o número para uma string com duas casas decimais
    const timeString = timeInput.toFixed(2) // Exemplo: 0.50

    // Separe a string em horas e minutos com base no ponto decimal
    const [hours, minutes] = timeString.split('.').map(Number)

    // Converta horas e minutos para minutos totais
    return hours * 60 + (minutes || 0)
  }

  /*
  function convertTimeInputToMinutes(timeInput: string) {
    const [hours, minutes] = timeInput.split(',').map(Number)

    // Verifica se hours e minutes são números válidos
    if (isNaN(hours) || isNaN(minutes)) {
      alert('Permitido apenas números separados por virgula')
    }

    return hours * 60 + minutes * 10 // Multiplica minutos por 10 para ajustar o formato
  }

  */
  /*
  function convertMinutesToTimeFormat(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.round((totalMinutes % 60) / 10) // Ajusta minutos para o formato h,m
    return `${hours},${minutes}`
  }
*/

  function convertMinutesToTimeFormat(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}min`
  }

  async function handleSaveAdjustments() {
    try {
      const adjustedMinutes = convertTimeInputToMinutes(value) // Converte para minutos
      const finalValue = isAdding ? adjustedMinutes : -adjustedMinutes

      await addAdjustment(employeeId, finalValue, description)
      setValue(0.1)
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
      <div className="mb-4 flex flex-col justify-center border-b-2 py-2 pb-4">
        <p className="flex justify-center text-lg font-medium">
          Total de Horas:
        </p>
        <p
          className={`flex justify-center rounded-full p-2 text-xl font-bold ${
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
          <Plus className="mr-2" />
          Extra
        </button>
        <button
          onClick={() => setIsAdding(false)}
          className={`flex items-center rounded-lg p-2 ${!isAdding ? 'bg-red-500 ring-1 ring-black' : 'bg-gray-400'} text-white`}
        >
          <Minus className="mr-2" />
          Falta
        </button>
      </div>
      <div className="mt-4 flex max-w-48 items-center">
        <div className="mr-2 h-7 w-7">
          {isAdding ? <Plus className="mr-2" /> : <Minus className="mr-2" />}
        </div>
        <Input
          autoFocus
          type="number"
          value={value}
          onChange={handleChange}
          placeholder="Quantidade (h,m)"
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
      <ModalConfirm handleSaveAdjustments={handleSaveAdjustments} />
      <ModalDelete handleDelete={handleDelete} />
    </div>
  )
}
