import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import OAuthButton from './OAuthButton'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    await signIn(email, password)
    // setEmail('')
    // setPassword('')
  }

  return (
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
      <button>ログイン</button>
      <p>または</p>
      <OAuthButton text={'signin_with'} />
    </form>
  )
}

export default SignInForm
