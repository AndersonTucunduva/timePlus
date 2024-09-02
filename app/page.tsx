import Employee from '@/components/Employee/Employee'
import InputEmployee from '@/components/InputEmployee/InputEmployee'

import { Employee as EmployeeType, getAllEmployees } from '@/app/api/actions' // Assumindo que você tenha uma interface definida aqui

export default async function Home() {
  // Faça a chamada da função de fetch aqui
  const employees: EmployeeType[] = await getAllEmployees()

  return (
    <div className="p-3">
      <div className="mb-4 flex">
        <InputEmployee />
      </div>
      <div>
        <Employee employees={employees} />
      </div>
    </div>
  )
}
