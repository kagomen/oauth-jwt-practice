/* eslint-disable react/prop-types */
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

function OAuthButton(props) {
  const { googleSignIn } = useAuth()

  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => googleSignIn(credentialResponse)}
        onError={() => console.error('Googleログインに失敗しました')}
        text={props.text}
        width="300px"
      />
    </div>
  )
}

export default OAuthButton
