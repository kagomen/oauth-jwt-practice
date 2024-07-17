import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import OAuthButton from './OAuthButton'

function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signUp } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    await signUp(email, password)
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
      <button>新規登録</button>
      <p>または</p>
      <OAuthButton text={'signup_with'} />
    </form>
  )
}

export default SignUpForm
