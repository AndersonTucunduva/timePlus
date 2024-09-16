import { ModalReset } from '../ModalReset/ModalReset'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { User as UsersType } from '@/app/api/actions'

function Users({ users }: { users: UsersType[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-md border-2 p-2 shadow-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {users
        .filter((user) => user.name !== 'admin')
        .map((user) => (
          <Popover key={user.id}>
            <PopoverTrigger asChild>
              <button className="flex min-h-10 w-full flex-col items-center gap-2 rounded-xl bg-slate-600 p-4 hover:bg-slate-500">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-lg font-medium text-white">
                  {user.password || 'Cargo não definido'}
                </p>
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <ModalReset userId={user.id} />
            </PopoverContent>
          </Popover>
        ))}
    </div>
  )
}

export default Users
