import Users from '@/components/Users/Users'
import { getAllUsers, User } from '../api/actions'

export default async function pass() {
  const users: User[] = await getAllUsers()
  return (
    <div>
      <div className="p-3 text-3xl font-semibold">Senhas</div>
      <div className="p-3">
        <Users users={users} />
      </div>
    </div>
  )
}
