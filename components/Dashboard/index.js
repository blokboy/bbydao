import Splash from "./Splash"
import ProfilesContainer from "./ProfilesContainer"

const Dashboard = () => {
  return (
    <div className="flex flex-col w-screen">
      <Splash />
      <ProfilesContainer />
    </div>
  )
}

export default Dashboard
