import { Navigate } from 'react-router-dom'
import SignUpForm from '../components/SignUpForm'
import { useAuth } from '../context/AuthContext'

function SignUpPage() {
  const { user } = useAuth()
  return (
    <div>
      {user ? (
        <Navigate to={`/${user}`} replace={true} />
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h3>新規登録</h3>
          <SignUpForm />
        </div>
      )}
    </div>
  )
}

export default SignUpPage
