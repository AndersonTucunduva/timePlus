'use client'

import { accessPass } from '@/app/api/actions'
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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ModalPass() {
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleTransaction() {
    const success = await accessPass(password)

    if (success) {
      setOpen(false) // Fechar o modal após sucesso
      router.push('/pass')
    } else {
      alert('Senha incorreta')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogTrigger asChild>
        <Link href="#" className="text-white">
          Password
        </Link>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Atenção</DialogTitle>
          <DialogDescription>
            Digite uma senha Master para liberar o acesso!
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
