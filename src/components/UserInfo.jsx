import { useAuth } from '../context/AuthContext'

function UserInfo() {
  const { user, signOut } = useAuth()
  function handleClick() {
    signOut()
  }
  return (
    <div>
      {user ? (
        <div>
          <p>{user}でログイン中です</p>
          <button onClick={handleClick}>ログアウト</button>
        </div>
      ) : (
        <p>ログインしてください</p>
      )}
    </div>
  )
}

export default UserInfo
