import { Navigate } from 'react-router-dom'
import SignInForm from '../components/SignInForm'
import { useAuth } from '../context/AuthContext'

function SignInPage() {
  const { user } = useAuth()
  return (
    <div>
      {user ? (
        <Navigate to="/user-page" replace={true} />
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h3>ログイン</h3>
          <SignInForm />
        </div>
      )}
    </div>
  )
}

export default SignInPage
