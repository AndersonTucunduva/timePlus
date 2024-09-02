import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import ModalAdjustments from '../ModalAdjustments/ModalAdjustments'
import { Employee as EmployeeType } from '@/app/api/actions'

function Employee({ employees }: { employees: EmployeeType[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-md border-2 p-2 shadow-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {employees.map((employee) => (
        <Popover key={employee.id}>
          <PopoverTrigger asChild>
            <button className="flex min-h-10 w-full flex-col items-center gap-2 rounded-xl bg-slate-600 p-4 hover:bg-slate-500">
              <h1 className="text-2xl font-bold text-white">{employee.name}</h1>
              <p className="text-lg font-medium text-white">
                {employee.role || 'Cargo não definido'}
              </p>
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <ModalAdjustments employeeId={employee.id} />
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}

export default Employee
