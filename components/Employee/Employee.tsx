'use client'

import { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Dialog, DialogTrigger, DialogContent } from '../ui/dialog'
import ModalAdjustments from '../ModalAdjustments/ModalAdjustments'
import { Employee as EmployeeType } from '@/app/api/actions'

// Hook para verificar a largura da tela
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [matches, query])

  return matches
}

function Employee({ employees }: { employees: EmployeeType[] }) {
  // Verifica se a tela é pequena (sm ou menor)
  const isSmallScreen = useMediaQuery('(max-width: 640px)')

  return (
    <div className="grid grid-cols-1 gap-4 rounded-md border-2 p-2 shadow-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {employees.map((employee) =>
        isSmallScreen ? (
          // Renderiza Dialog em telas pequenas
          <Dialog key={employee.id}>
            <DialogTrigger asChild>
              <button className="flex min-h-10 w-full flex-col items-center gap-2 rounded-xl bg-slate-600 p-4 hover:bg-slate-500">
                <h1 className="text-2xl font-bold text-white">
                  {employee.name}
                </h1>
                <p className="text-lg font-medium text-white">
                  {employee.role || 'Cargo não definido'}
                </p>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-80 p-4">
              <ModalAdjustments employeeId={employee.id} />
            </DialogContent>
          </Dialog>
        ) : (
          // Renderiza Popover em telas maiores
          <Popover key={employee.id}>
            <PopoverTrigger asChild>
              <button className="flex min-h-10 w-full flex-col items-center gap-2 rounded-xl bg-slate-600 p-4 hover:bg-slate-500">
                <h1 className="text-2xl font-bold text-white">
                  {employee.name}
                </h1>
                <p className="text-lg font-medium text-white">
                  {employee.role || 'Cargo não definido'}
                </p>
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <ModalAdjustments employeeId={employee.id} />
            </PopoverContent>
          </Popover>
        ),
      )}
    </div>
  )
}

export default Employee
