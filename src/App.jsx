import axios from 'axios'
import SignUpForm from './components/SignUpForm'
import SignInForm from './components/SignInForm'

function App() {
  async function test(e) {
    e.preventDefault()
    const res = await axios.get('/test')
    console.log(res.data)
  }

  return (
    <div>
      <SignUpForm />
      <SignInForm />
    </div>
  )
}

export default App
