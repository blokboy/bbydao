import Nav from "./Nav"
import ConnectModal from "./ConnectModal"
import AppSearchModal from "../AppSearchModal"
import CreateThreadModal from "../Messages/CreateThreadModal"
import FriendsModal from "../UserDashboard/FriendsModal"
import OfferModal from "../OpenSeaCollection/OfferModal"
import BuyModal from "../OpenSeaCollection/BuyModal"

const Layout = ({ children }) => {
  return (
    <>
      <Nav />
      <main className="w-full">
        {children}
        <ConnectModal />
        <AppSearchModal />
        <CreateThreadModal />
        <FriendsModal />
        <OfferModal />
        <BuyModal />
      </main>
    </>
  )
}

export default Layout
