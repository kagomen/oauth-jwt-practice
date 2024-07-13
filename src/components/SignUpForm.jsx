import axios from 'axios'
import { useState } from 'react'

function SignUpForm() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  async function signUp(e) {
    e.preventDefault()
    const signUpData = {
      email: email,
      password: pass,
    }
    try {
      const res = await axios.post('/api/sign-up', signUpData)
      console.log(res.data)

      setEmail('')
      setPass('')
    } catch (err) {
      throw new Error(err.message)
    }
  }

  return (
    <form onSubmit={signUp}>
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
      <button>sign up</button>
    </form>
  )
}

export default SignUpForm
