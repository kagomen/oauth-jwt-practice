import { Link } from 'react-router-dom'
import UserInfo from '../UserInfo'
import { useAuth } from '../../context/AuthContext'

function Header() {
  const { user, signOut } = useAuth()
  function handleClick() {
    signOut()
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid',
      }}
    >
      <UserInfo />
      {user ? (
        <button onClick={handleClick}>ログアウト</button>
      ) : (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/sign-in">ログイン</Link>
          <Link to="/sign-up">新規登録</Link>
        </div>
      )}
    </div>
  )
}

export default Header
