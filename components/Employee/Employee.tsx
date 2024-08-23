import { getAllEmployees } from '@/app/api/route'

export default async function Employee() {
  const employees = await getAllEmployees()

  return (
    <div>
      {employees.map((employee) => (
        <button
          key={employee.id}
          className="mb-2 flex min-h-10 w-80 flex-col items-center gap-2 rounded-xl bg-slate-500 p-2"
        >
          <h1 className="text-2xl font-bold text-white">{employee.name}</h1>
          <p className="text-lg font-medium text-white">
            {employee.role || 'Cargo não definido'}
          </p>
        </button>
      ))}
    </div>
  )
}
