import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import OAuthButton from './OAuthButton'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signInMutation } = useAuth()
  const { mutate: signIn, isPending, isError, error } = signInMutation

  async function handleSubmit(e) {
    e.preventDefault()
    await signIn({ email, password })
  }

  return (
    <div>
      <p style={{ color: 'red', fontSize: '14px' }}>
        {isError ? error.response.data.message : ''}
      </p>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '300px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="email"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
        />
        <button disabled={isPending}>ログイン</button>
        <p>または</p>
        <OAuthButton text={'signin_with'} />
      </form>
    </div>
  )
}

export default SignInForm
