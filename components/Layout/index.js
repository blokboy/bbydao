import Nav from "./Nav"
import dynamic from 'next/dynamic'
const Search = dynamic(() => import('./Search'))
import { useLayoutStore } from "/stores/useLayoutStore"

import ConnectModal from "./ConnectModal"
import AppSearchModal from "../AppSearchModal"
import CreateThreadModal from "../Messages/CreateThreadModal"
import FriendsModal from "../UserDashboard/FriendsModal"
import UnfriendModal from "../UserDashboard/UnfriendModal"
import OfferModal from "../OpenSeaCollection/OfferModal"
import BuyModal from "../OpenSeaCollection/BuyModal"
import NetworkWarning from "./Nav/NetworkWarning"
import MobileNotificationsModal from "../MobileNotificationsModal"
import DaoForm from "components/Forms/DaoForm"

const Layout = ({ children }) => {
  const searchOpen = useLayoutStore(state => state.searchOpen)

  return (
    <main className="w-full">
      <Nav />
      <NetworkWarning />
      {searchOpen ? <Search /> : children}
      <DaoForm />
      <ConnectModal />
      <AppSearchModal />
      <CreateThreadModal />
      <FriendsModal />
      <OfferModal />
      <BuyModal />
      <UnfriendModal />
      <MobileNotificationsModal />
    </main>
  )
}

export default Layout
