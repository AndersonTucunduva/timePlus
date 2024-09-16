'use client'

import { resetPassword } from '@/app/api/actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Check } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'

interface Props {
  userId: number
}

export function ModalReset({ userId }: Props) {
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  async function handleTransaction() {
    if (password === '') return
    const result = await resetPassword(userId, password)
    if (result) {
      toast({
        variant: 'default',
        description: 'Senha alterada com Sucesso',
        duration: 1000,
      })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-2 flex w-full gap-2 bg-red-500 text-white hover:bg-red-600 hover:text-white"
        >
          Alterar senha
          <Check width={20} height={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Atenção</DialogTitle>
          <DialogDescription>
            Digite a nova senha para esse usuário!
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center py-3">
          <Input
            id="password"
            autoComplete="off"
            type="password"
            className="col-span-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            className="bg-slate-600 hover:bg-slate-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleTransaction}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
