import React        from 'react'
import {FaEthereum} from 'react-icons/fa'

const TokenImg = ({token, isUniV2}) => {
    return (
        <div className="mr-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
            {(isUniV2 && (
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Uniswap_Logo.svg" alt="Uniswap Logo" />
            )) || <>{token.logoUri ? <img src={token.logoUri} alt={""} /> : <FaEthereum size={30} />}</>}
        </div>
    )
}

export default TokenImg
