import MonthPicker from '@/components/MonthPicker/MonthPicker'

export default function Reports() {
  return (
    <div>
      <header className="my-4 flex justify-center text-xl font-bold">
        Relatório
      </header>
      <div className="flex justify-center">
        <MonthPicker />
      </div>
    </div>
  )
}
