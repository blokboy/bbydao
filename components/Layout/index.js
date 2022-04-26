import Nav from "./Nav"
import Search from "./Search"
import { useLayoutStore } from "/stores/useLayoutStore"

import ConnectModal from "./ConnectModal"
import AppSearchModal from "../AppSearchModal"
import CreateThreadModal from "../Messages/CreateThreadModal"
import FriendsModal from "../UserDashboard/FriendsModal"
import UnfriendModal from "../UserDashboard/UnfriendModal"
import OfferModal from "../OpenSeaCollection/OfferModal"
import BuyModal from "../OpenSeaCollection/BuyModal"

const Layout = ({ children }) => {
  const searchOpen = useLayoutStore(state => state.searchOpen)

  return (
    <main className="w-full">
      <Nav />
      {searchOpen ? <Search /> : children}
      <ConnectModal />
      <AppSearchModal />
      <CreateThreadModal />
      <FriendsModal />
      <OfferModal />
      <BuyModal />
      <UnfriendModal />
    </main>
  )
}

export default Layout
