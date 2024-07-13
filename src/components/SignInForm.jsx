import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

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
    <form onSubmit={handleSubmit}>
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
      <button>sign in</button>
    </form>
  )
}

export default SignInForm
