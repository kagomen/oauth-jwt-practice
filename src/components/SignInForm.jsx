import axios from 'axios'
import { useState } from 'react'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  async function signIn(e) {
    e.preventDefault()
    const signInData = {
      email: email,
      password: pass,
    }
    const res = await axios.post('/api/sign-in', signInData)
    console.log(res.data)

    setEmail('')
    setPass('')
  }

  return (
    <form onSubmit={signIn}>
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="email"
      />
      <input
        onChange={(e) => setPass(e.target.value)}
        type="password"
        placeholder="password"
      />
      <button>sign in</button>
    </form>
  )
}

export default SignInForm
