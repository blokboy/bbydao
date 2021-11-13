import Splash from "./Splash"
import ProfilesContainer from "./ProfilesContainer"

const Dashboard = props => {
  const { accounts } = props
  return (
    <div className="flex flex-col w-screen">
      {accounts ? <h1>accounts: {accounts}</h1> : <></>}
      <Splash />
      <ProfilesContainer />
    </div>
  )
}

export default Dashboard
