'use client'

import { Minus, Plus } from 'lucide-react'
import { Input } from '../ui/input'
import { useState } from 'react'
import { addAdjustment } from '@/app/api/route'
import { useToast } from '@/components/ui/use-toast'

interface Props {
  employeeId: number
}

export default function ModalAdjustments({ employeeId }: Props) {
  const [value, setValue] = useState(1)
  const [description, setDescription] = useState('')
  const [isAdding, setIsAdding] = useState<boolean>(true)
  const { toast } = useToast()

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
        description: 'Hora Extra adicionado com sucesso!',
        duration: 1000,
      })
    } catch (error) {
      console.error('Erro ao salvar ajuste:', error)
    }
  }

  return (
    <div>
      <div className="mb-2 flex justify-center">
        <button
          onClick={() => setIsAdding(true)}
          className={`mr-4 flex items-center rounded-lg p-2 ${isAdding ? 'bg-green-500 ring-1 ring-black' : 'bg-gray-400'} text-white`}
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
      <button
        onClick={handleSaveAdjustments}
        className="mt-4 w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
      >
        Salvar
      </button>
    </div>
  )
}
