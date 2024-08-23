import Employee from '@/components/Employee/Employee'
import InputEmployee from '@/components/InputEmployee/InputEmployee'

export default function Home() {
  return (
    <div className="p-3">
      <div className="mb-4 flex">
        <InputEmployee />
      </div>
      <div>
        <Employee />
      </div>
    </div>
  )
}
