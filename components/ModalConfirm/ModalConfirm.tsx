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
  handleSaveAdjustments: (userId: number) => void
}

export function ModalConfirm({ handleSaveAdjustments }: Props) {
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false)
  const [showPasswordInput, setShowPasswordInput] = useState(false)

  async function handleTransaction() {
    const success = await authTransaction(password)

    if (success && success.id) {
      handleSaveAdjustments(success.id)
      setOpen(false)
      setPassword('') // Limpa o campo de senha após sucesso
    } else {
      alert('Senha incorreta')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen) {
          setShowPasswordInput(true)
        } else {
          setShowPasswordInput(false)
          setPassword('')
        }
      }}
    >
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
        <form autoComplete="off">
          <div className="flex items-center py-3">
            {showPasswordInput && (
              <Input
                id="password"
                autoComplete="new-password"
                name="random-password-field"
                type="password"
                className="col-span-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </div>
        </form>
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
