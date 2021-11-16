const LoginModal = () => {
  return (
    // negative margin to cover nav -mt-20
    // clicking on bg will close modal, needs to be in Nav state
    <div className="absolute h-screen w-screen z-10 bg-transparent bg-opacity-60 backdrop-filter backdrop-blur">
      <div className="flex justify-center items-center h-5/6 w-screen ml-2 md:h-4/6 md:w-1/3 md:mx-auto mt-10 rounded-2xl bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
        Hello
      </div>
    </div>
  )
}

export default LoginModal
