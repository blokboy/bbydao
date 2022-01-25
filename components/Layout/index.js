import Nav from "./Nav"
import ConnectModal from "./ConnectModal"
import AppSearchModal from "../AppSearchModal"

const index = ({ children }) => {
  return (
    <>
      <Nav />
      <main className="h-screen w-screen">
        {children}
        <ConnectModal />
        <AppSearchModal />
      </main>
    </>
  )
}

export default index
