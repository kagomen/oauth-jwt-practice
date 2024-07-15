/* eslint-disable react/prop-types */
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

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
    try {
      // リフレッシュトークンを無効化
      await axios.post('/api/sign-out')
      console.log('リフレッシュトークンを無効化しました')
    } catch (error) {
      console.error('リフレッシュトークンを無効化できませんでした', error)
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }

  const reissueAccessToken = useCallback(async () => {
    try {
      const res = await axios.post(
        '/api/reissue-access-token',
        {},
        {
          withCredentials: true,
        }
      )
      setAccessToken(res.data.accessToken)
      setUser(res.data.email)
    } catch (error) {
      console.error('アクセストークンの再発行に失敗しました', error)
      signOut()
    }
  }, [])

  // ログイン状態のチェックをコンポーネントのマウント時に実行
  const checkAuthStatus = useCallback(async () => {
    if (!accessToken) {
      // アクセストークンがない場合、リフレッシュトークンを使って再取得を試みる
      try {
        await reissueAccessToken()
      } catch (error) {
        console.error('自動ログインに失敗しました:', error)
        // 必要に応じて、ログインページにリダイレクトするなどの処理を追加
      }
    } else {
      // アクセストークンがある場合は有効期限をチェック
      const decodedAccessToken = jwtDecode(accessToken)
      if (Date.now() >= decodedAccessToken.exp * 1000) {
        await reissueAccessToken()
      }
    }
  }, [accessToken, reissueAccessToken])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  // アクセストークンを使用するAPIリクエストのためのラッパー関数
  // await authRequest(post, '/api/sign-up', { email, password }) のようにして使用する
  const authRequest = useCallback(
    async (method, url, data = null) => {
      const config = {
        method,
        url,
        data,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        withCredentials: true,
      }
      try {
        const res = await axios(config)
        return res.data
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const newToken = await reissueAccessToken()
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`
            return axios(config)
          }
        }
        throw error
      }
    },
    [accessToken, reissueAccessToken]
  )

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        signUp,
        signIn,
        signOut,
        checkAuthStatus,
        authRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
