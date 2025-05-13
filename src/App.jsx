import Header from "./components/Header"
import Main from "./components/Main"
import React from "react"


function App() {
  React.useEffect(() => {
        alert(`Screenshot the meme.\nOtherwise hold and save for template.`)
    },[])

  return (
    <>
      <Header />
      <Main />
    </>
  )
}

export default App
