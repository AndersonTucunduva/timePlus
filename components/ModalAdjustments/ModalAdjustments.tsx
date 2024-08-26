'use client'

import { Minus, Plus } from 'lucide-react'
import { Input } from '../ui/input'
import { useEffect, useState } from 'react'
import { addAdjustment, getEmployeeTotalBalance } from '@/app/api/actions'
import { useToast } from '@/components/ui/use-toast'
import { ModalConfirm } from '../ModalConfirm/ModalConfirm'

interface Props {
  employeeId: number
}

export default function ModalAdjustments({ employeeId }: Props) {
  const [value, setValue] = useState(1)
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

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = Number(event.target.value)
    if (newValue >= 1) {
      setValue(newValue)
    }
  }

  function handleChangeDescription(event: React.ChangeEvent<HTMLInputElement>) {
    setDescription(event.target.value)
  }

  async function handleSaveAdjustments() {
    try {
      const finalValue = isAdding ? value : -value
      await addAdjustment(employeeId, finalValue, description)
      setValue(1)
      setDescription('')
      toast({
        variant: 'default',
        description: 'Hora adicionado com sucesso!',
        duration: 1000,
      })
      const updatedBalance = await getEmployeeTotalBalance(employeeId)
      setTotalBalance(updatedBalance)
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
          {totalBalance !== null ? `${totalBalance} minutos` : 'Carregando...'}
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
          placeholder="Quantidade"
        />
        <p className="ml-4">Minutos</p>
      </div>
      <div className="mt-4">
        <Input
          placeholder="Descrição (Opcional)"
          value={description}
          onChange={handleChangeDescription}
        />
      </div>
      <ModalConfirm handleSaveAdjustments={handleSaveAdjustments} />
    </div>
  )
}
