import Profile from "./Profile"

const ProfilesContainer = () => {
  return (
    <div className="flex w-screen justify-center sm:px-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Profile />
        <Profile />
        <Profile />
        <Profile />
      </div>
    </div>
  )
}

export default ProfilesContainer
