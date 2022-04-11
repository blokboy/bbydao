import React from "react"
import TokenCard from "./TokenCard"
import { tokenList } from "ABIs/tokens"
import { ChainId, Token, WETH, Pair, TokenAmount } from "@uniswap/sdk";

const Tokens = ({ tokens }) => {

// note that you may want/need to handle this async code differently,
// for example if top-level await is not an option
  async function getPair() {
    const pairAddress = Pair.getAddress(DAI, WETH[DAI.chainId]);
    console.log('pair addr ', pairAddress)
    
    const reserves = [ pairAddress ];
    const [reserve0, reserve1] = reserves;
    console.log('res ', reserves, reserve0, reserve1)

    /*
    const tokens = [DAI, WETH[DAI.chainId]];
    const [token0, token1] = tokens[0].sortsBefore(tokens[1])
    ? tokens
    : [tokens[1], tokens[0]];

    const pair = new Pair(
      new TokenAmount(token0, reserve0),
      new TokenAmount(token1, reserve1)
    );
  return pair;
  */
  }

  const DAI = new Token(
    ChainId.MAINNET,
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    18,
    "DAI",
    "Dai Stablecoin"
  );


  const pair = getPair().then( res => {
    console.log('pair res ', res)
  });

  console.log('pair ', pair)
  return (
    <div>
      Tokens:
      {
        tokens && tokens.map(token => {
          return <TokenCard token={token} />
        })  
      }
    </div>
  )
}

export default Tokens
