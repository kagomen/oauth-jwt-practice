/* eslint-disable react/prop-types */
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)

  const signUpMutation = useMutation({
    mutationFn: (credentials) => axios.post('/api/auth/sign-up', credentials),
    onSuccess: (res) => {
      setAccessToken(res.data.accessToken)
      setUser(res.data.email)
      console.log('新規登録完了', res.data)
    },
    onError: (err) =>
      console.error('新規登録に失敗しました', err.response.data.message),
  })

  const signInMutation = useMutation({
    mutationFn: (credentials) => axios.post('/api/auth/sign-in', credentials),
    onSuccess: (res) => {
      setAccessToken(res.data.accessToken)
      setUser(res.data.email)
      console.log('ログイン成功:', res.data)
    },
    onError: (err) =>
      console.error('ログインに失敗しました', err.response.data.message),
  })

  const signOutMutation = useMutation({
    mutationFn: () => axios.post('/api/auth/sign-out'),
    onSuccess: () => {
      setAccessToken(null)
      setUser(null)
      console.log('リフレッシュトークンを無効化しました')
    },
    onError: (err) => {
      setAccessToken(null)
      setUser(null)
      console.error(
        'リフレッシュトークンを無効化できませんでした',
        err.response.data.message
      )
    },
  })

  const reissueAccessTokenMutation = useMutation({
    mutationFn: () =>
      axios.post(
        '/api/auth/reissue-access-token',
        {},
        { withCredentials: true }
      ),
    onSuccess: (res) => {
      setAccessToken(res.data.accessToken)
      setUser(res.data.email)
      console.log('アクセストークンを再発行しました')
    },
    onError: (err) => {
      console.error(
        'アクセストークンの再発行に失敗しました',
        err.response.data.message
      )
      signOutMutation.mutate()
    },
  })

  // ログイン状態のチェックをコンポーネントのマウント時に実行
  const { refetch: checkAuthStatus } = useQuery({
    queryKey: ['authStatus'],
    queryFn: async () => {
      console.log('checkAuthStatus実行')
      if (!accessToken) {
        // アクセストークンがない場合、リフレッシュトークンを使って再取得を試みる
        await reissueAccessTokenMutation.mutateAsync()
      } else {
        // アクセストークンがある場合は有効期限をチェック
        const decodedAccessToken = jwtDecode(accessToken)
        if (Date.now() >= decodedAccessToken.exp * 1000) {
          await reissueAccessTokenMutation.mutateAsync()
        } else {
          console.log('アクセストークンは有効です')
        }
      }
      if (!accessToken) {
        throw new Error('認証に失敗しました')
      }
      return { isAuthenticated: true } // checkAuthStatus.data?.isAuthenticatedで認証状態を呼び出せる
    },
    enabled: true, // 自動リフェッチを有効
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 10 * 60 * 1000, // 10分間はデータを新鮮とみなす
  })

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  // アクセストークンを使用するAPIリクエストのためのラッパー関数
  const authRequest = async (method, url, data = null) => {
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
        const newToken = await reissueAccessTokenMutation.mutateAsync()
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`
          return axios(config)
        }
      }
      throw error
    }
  }

  const googleSignInMutation = useMutation({
    mutationFn: (credentialResponse) =>
      axios.post('/api/auth/google', {
        credential: credentialResponse.credential,
      }),
    onSuccess: (res) => {
      setUser(res.data.email)
      setAccessToken(res.data.accessToken)
      console.log('Googleログイン成功', res.data)
    },
    onError: (err) =>
      console.error(
        'Googleログインでエラーが発生しました:',
        err.response.data.message
      ),
  })

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        signUpMutation,
        signInMutation,
        signOut: signOutMutation.mutate,
        checkAuthStatus,
        authRequest,
        googleSignIn: googleSignInMutation.mutate,
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
