import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'

function UserPage() {
  const { checkAuthStatus, authRequest } = useAuth()
  const { userName } = useParams()

  const userPageQuery = useQuery({
    queryKey: ['userPage', userName, checkAuthStatus.isSuccess],
    queryFn: async () => {
      await checkAuthStatus()
      return authRequest('GET', `/api/user/${userName}`)
    },
    enabled: checkAuthStatus.isSuccess,
    retry: false,
  })

  if (checkAuthStatus.isError || userPageQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (checkAuthStatus.isError || userPageQuery.isError) {
    return <Navigate to="/sign-in" replace={true} />
  }

  return <h3>{userName}のページ</h3>
}

export default UserPage
