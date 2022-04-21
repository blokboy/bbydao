import Nav from "./Nav"
import Footer from "./Footer"

const Mint = ({ children }) => {
    return (
    <main className="h-full w-full bg-white dark:bg-slate-900 overflow-y-auto">

        <Nav></Nav>
        <div className="flex flex-col z-30">
            <div className="flex flex-row h-screen relative">
                <div className="flex flex-col justify-center items-start md:px-20 md:w-1/2">
                    <p className="text-6xl"> NEW-GEN DAO </p>
                    <p className="text-l">A system where everyone has a say. A fair management system. </p>
                </div>
                <div className="flex flex-col pt-16 md:w-1/2 bg-contain bg-no-repeat bg-right-top overflow-visible" style={{
                    backgroundImage: "url('/mint/rainbow_behind_card.png')"
                }}>
                    <img className="object-cover object-left-bottom" src="/mint/light_card.png" alt="lightcard" />
                </div>
            </div>

            <div className="flex flex-row h-screen relative">
                <div className="flex flex-col pt-16 md:w-1/2 bg-contain bg-no-repeat bg-left-top overflow-visible" style={{
                        backgroundImage: "url('/mint/blue_gradient_behind_network.png')"
                    }}>
                    <img className="object-cover object-right" src="/mint/network.png" alt="lightcard" />

                </div>
                <div className="flex flex-col justify-center items-start md:px-20 md:w-1/2">
                    <p className="text-6xl"> WHY YOU CHOOSE bbyDAO? </p>
                    <p className="text-l">bbyDAO is a software that plans to solve the dificiencies in management with Web3. </p>
                </div>
            </div>

            <div className="flex flex-row h-screen relative">
                <div className="flex flex-col justify-center items-start md:px-20 md:w-1/2">
                    <p className="text-6xl"> MINT YOUR bbyDAO Card </p>
                    <p className="text-l">To be with us, you can get your bbyDAO NFT. Then a lil Lorem ipsum</p>
                </div>
                <div className="flex flex-col pt-16 md:w-1/2 overflow-visible">
                    <img className="object-cover object-left" src="/mint/card_content_light.png" alt="cardcontentlight" />
                </div>
            </div>

            
        </div>
            
        



        <Footer></Footer>

    </main>
    )
}

export default Mint