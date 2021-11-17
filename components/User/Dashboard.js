import Splash from "../Layout/Splash"
import ProfilesContainer from "./ProfilesContainer"

const Dashboard = props => {
  const { rainbowAccount, disconnect } = props
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
