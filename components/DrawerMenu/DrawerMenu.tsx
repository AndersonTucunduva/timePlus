import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'

export function DrawerMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild className="flex">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="p-2 text-white">
            <LayoutGrid />
          </Button>
          <p className="ml-3 text-xl font-bold text-white">Time Plus</p>
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] bg-slate-700">
        <SheetHeader>
          <SheetTitle className="mt-8 text-2xl text-white">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col space-y-4">
          <SheetClose asChild>
            <Link href="/" className="mt-4 text-white">
              Lançamentos
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/reports" className="mt-4 text-white">
              Relatório
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
