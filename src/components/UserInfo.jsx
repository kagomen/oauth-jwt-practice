import { useAuth } from '../context/AuthContext'

function UserInfo() {
  const { user } = useAuth()
  return <div>こんにちは、{user ? user : 'Guest'} さん！</div>
}

export default UserInfo
