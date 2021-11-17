import Splash from "../Layout/Splash"
import ProfilesContainer from "./ProfilesContainer"
import { useRainbowButton } from "../../hooks/useRainbowButton"
import { useAccountStore } from "../../stores/useAccountStore"

const Dashboard = () => {
  const { disconnect } = useRainbowButton()
  const rainbowAccount = useAccountStore(state => state.rainbowAccount)

  return (
    <div className="flex flex-col w-screen">
      {rainbowAccount ? (
        <>
          <h1>rainbowAccount: {rainbowAccount}</h1>
          <button onClick={disconnect}>disconnect</button>
        </>
      ) : (
        <></>
      )}
      <Splash />
      <ProfilesContainer />
    </div>
  )
}

export default Dashboard
