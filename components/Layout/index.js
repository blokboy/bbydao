import Nav from "./Nav"
import AppSearchModal from "../AppSearchModal"

const index = ({ children }) => {
  return (
    <>
      <Nav />
      <main className="w-screen">
        {children}
        <AppSearchModal />
      </main>
    </>
  )
}

export default index
