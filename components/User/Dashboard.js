import Splash from "../Layout/Splash"
import ProfilesContainer from "./ProfilesContainer"

const Dashboard = props => {
  const { accounts, disconnect } = props
  return (
    <div className="flex flex-col w-screen">
      {accounts ? (
        <>
          <h1>accounts: {accounts}</h1>
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
