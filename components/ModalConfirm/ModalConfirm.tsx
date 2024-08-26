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
import { Check } from 'lucide-react'

import { useState } from 'react'

interface Props {
  handleSaveAdjustments: () => void
}

export function ModalConfirm({ handleSaveAdjustments }: Props) {
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false)

  async function handleTransaction() {
    const success = await authTransaction(password)

    if (success) {
      handleSaveAdjustments()
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
          className="mt-2 flex w-full gap-2 bg-green-500 text-white hover:bg-green-600 hover:text-white"
        >
          Salvar
          <Check width={20} height={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Atenção</DialogTitle>
          <DialogDescription>
            Digite sua senha para confirmar a transação!!
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center py-3">
          <Input
            id="password"
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
