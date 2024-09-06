import Employee from '@/components/Employee/Employee'
import InputEmployee from '@/components/InputEmployee/InputEmployee'

import { Employee as EmployeeType, getAllEmployees } from '@/app/api/actions'

export default async function Home() {
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
