/* eslint-disable react/prop-types */
import axios from 'axios'
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)

  async function signUp(email, password) {
    try {
      const res = await axios.post('/api/sign-up', { email, password })
      setAccessToken(res.data.accessToken)
      setUser(res.data.email)
      console.log('新規登録完了', res.data)
    } catch (err) {
      console.error(err.response.data.message)
    }
  }

  async function signIn(email, password) {
    try {
      const res = await axios.post('/api/sign-in', { email, password })
      setAccessToken(res.data.accessToken)
      setUser(res.data.email)
      console.log('ログイン成功:', res.data)
    } catch (err) {
      console.error(err.response.data.message)
    }
  }

  async function signOut() {
    // リフレッシュトークンを無効化

    setAccessToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ accessToken, user, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
