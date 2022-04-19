import Nav from "./Nav"
import Footer from "./Footer"

const Mint = ({ children }) => {
    return (
    <main className="h-screen w-full bg-white dark:bg-slate-900">
        <Nav></Nav>
        {children}
        <Footer></Footer>
    </main>
    )
}

export default Mint