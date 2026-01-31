import { useState } from 'react'
import Principal from '../src/Components/Jewerly/Principal'
import Routing from './Components/Routes/Routing';
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (

    <>
      <Router>
        <Routing />
      </Router>
    </>
  )
}

export default App
