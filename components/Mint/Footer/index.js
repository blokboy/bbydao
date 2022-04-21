const Footer = ({ children }) => {
    return (
        <div className="flex flex-col h-[46vh] pb-20 justify-end items-center bg-contain bg-no-repeat bg-center overflow-visible" style={{
            backgroundImage: "url('/mint/Footer_rainbow.png')"
        }}>
            
            <div className="flex">
                <p className="text-3xl">LOGO GOING HERE G</p>
            </div>
            <div className="flex">
                <p className="text-l">links links links</p>
            </div>
        </div>
    )
}

export default Footer