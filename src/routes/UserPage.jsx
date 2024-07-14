import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function UserPage() {
  const { user } = useAuth()
  return (
    <div>
      {user ? (
        <h3>ユーザーページ</h3>
      ) : (
        <Navigate to="/guest-page" replace={true} />
      )}
    </div>
  )
}

export default UserPage
