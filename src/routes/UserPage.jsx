import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

function UserPage() {
  const { user, checkAuthStatus, authRequest } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(null)
  const { userName } = useParams()

  useEffect(() => {
    const verifyAccess = async () => {
      if (!user) {
        setIsAuthorized(false)
        return
      }
      await checkAuthStatus()
      try {
        await authRequest('GET', `/api/user/${userName}`)
        setIsAuthorized(true)
        console.log('ユーザー情報が一致しました')
      } catch (error) {
        setIsAuthorized(false)
        console.error('ユーザー情報が一致しません', error)
      }
    }
    verifyAccess()
  }, [authRequest, checkAuthStatus, user, userName])

  return (
    <div>
      {isAuthorized === null ? (
        <div>Loading...</div>
      ) : isAuthorized ? (
        <h3>{userName}のページ</h3>
      ) : (
        <Navigate to="/sign-in" replace={true} />
      )}
    </div>
  )
}

export default UserPage
