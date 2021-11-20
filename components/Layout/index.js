import Nav from "./Nav"

const index = ({ children }) => {
  return (
    <>
      <Nav />
      <main className="w-screen">{children}</main>
    </>
  )
}

export default index
