import Nav from "./Nav"
import ConnectModal from "./ConnectModal"
import AppSearchModal from "../AppSearchModal"
import CreateThreadModal from "../Messages/CreateThreadModal"

const Layout = ({ children }) => {
  return (
    <>
      <Nav />
      <main className="w-full">
        {children}
        <ConnectModal />
        <AppSearchModal />
        <CreateThreadModal />
      </main>
    </>
  )
}

export default Layout
