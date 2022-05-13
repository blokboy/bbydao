import { TokenAmount } from "@uniswap/sdk"
import { BigNumber, ethers } from "ethers"
import { formatUnits } from "ethers/lib/utils"

/*  decimal integer  */
//TODO: can probably uses BigNumber for this
export const amount = (amount, decimals) => Math.round(amount * 10 ** (decimals || 18)).toString()

//TODO: can probably uses BigNumber for this

/* Human Readable Token Balance  */
export const readableTokenBalance = token => {
  if (parseInt(token?.fiatBalance) === 0) return 0

  //change this flatten in LP
  return Number((token?.balance / 10 ** (token?.decimals || token?.token?.decimals)).toString().match(/^\d+(?:\.\d{0,3})?/))
}

//TODO: can probably abstract this into contract interface
/*  Get Total Pair supply from Uniswap Contract */
const totalPairSupply = async (pair, abi) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(pair.liquidityToken.address, abi, provider)
    return contract.totalSupply()
  } catch (err) {
    console.log("err", err)
  }
}

/* Handle interaction with Uniswap to get LP information  */
export const getLiquidityPairInfo = async ({
  pair,
  token0,
  token0Input,
  token0ETHConversion,
  token1,
  token1Input,
  token1ETHConversion,
  abi,
}) => {
  try {
    if (!!pair) {
      /* Get Total Supply of LP pair on-chain  */
      const total = await totalPairSupply(pair, abi)
      const totalTokenAmount = await new TokenAmount(pair.liquidityToken, total)
      const token0Amount = await new TokenAmount(token0, amount(token0Input, token0?.decimals))
      const token0AmountInEth = (token0Input * token0ETHConversion).toFixed(token0?.decimals).toString()
      const token1Amount = await new TokenAmount(token1, amount(token1Input, token1?.decimals))
      const token1AmountInEth = (token1Input * token1ETHConversion).toFixed(token1?.decimals).toString()
      const uniswapTokensMinted = pair
        ?.getLiquidityMinted(totalTokenAmount, token0Amount, token1Amount)
        .toFixed(pair.liquidityToken.decimals)
      const percentageOfPool = uniswapTokensMinted / totalTokenAmount.toFixed(pair.liquidityToken.decimals)
      const uniswapPairURI = `https://v2.info.uniswap.org/pair/${pair.liquidityToken.address}`
      const etherscanURI = `https://etherscan.io/address/${pair.liquidityToken.address}`
      const transactionInfo = [
        {
          token: token0,
          amount: Number(token0Input),
          amountInWei: ethers.utils.parseEther(token0AmountInEth),
        },
        {
          token: token1,
          amount: Number(token1Input),
          amountInWei: ethers.utils.parseEther(token1AmountInEth),
        },
      ]

      return {
        percentageOfPool,
        total: formatUnits(BigNumber.from(total._hex)),
        transactionInfo,
        uniswapTokensMinted,
        uris: {
          uniswap: uniswapPairURI,
          etherscan: etherscanURI,
        },
      }
    }
  } catch (err) {
    console.log("err", err)
  }
}
