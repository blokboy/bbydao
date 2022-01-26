import Nav from "./Nav"
import ConnectModal from "./ConnectModal"
import AppSearchModal from "../AppSearchModal"

const Layout = ({ children }) => {
  return (
    <>
      <Nav />
      <main className="w-screen">
        {children}
        <ConnectModal />
        <AppSearchModal />
      </main>
    </>
  )
}

export default Layout
