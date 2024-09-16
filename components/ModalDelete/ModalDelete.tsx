import { authTransaction } from '@/app/api/actions'
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
import { X } from 'lucide-react'

import { useState } from 'react'

interface Props {
  handleDelete: () => void
}

export function ModalDelete({ handleDelete }: Props) {
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false)

  async function handleTransaction() {
    const success = await authTransaction(password)

    if (success?.isMaster === true) {
      handleDelete()
      setOpen(false)
    } else {
      alert('Senha incorreta')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-2 flex w-full gap-2 bg-red-500 text-white hover:bg-red-600 hover:text-white"
        >
          Excluir
          <X width={20} height={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Atenção</DialogTitle>
          <DialogDescription>
            Digite sua senha para excluir o funcionário!!
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
            className="bg-red-500 hover:bg-red-600"
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
