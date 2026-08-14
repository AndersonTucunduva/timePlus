import Users from '@/components/Users/Users'
import { getAllUsers, User } from '../api/actions'

export const dynamic = 'force-dynamic'

export default async function pass() {
  'use server'
  const users: User[] = await getAllUsers()
  return (
    <div>
      <div className="p-3 text-3xl font-semibold">Usuários</div>
      <div className="p-3">
        <Users users={users} />
      </div>
    </div>
  )
}
