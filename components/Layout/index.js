import Nav from "./Nav"

const index = ({ children }) => {
  return (
    <>
      <Nav />
      <main>{children}</main>
    </>
  )
}

export default index
