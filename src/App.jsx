import axios from 'axios'

function App() {
  async function test() {
    const res = await axios.get('/test')
    console.log(res.data)
  }

  return (
    <>
      <button onClick={test}>test!</button>
    </>
  )
}

export default App
