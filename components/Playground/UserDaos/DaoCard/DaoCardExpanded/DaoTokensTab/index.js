import React            from "react"
import TokenCard        from "./TokenCard"

const DaoTokensTab = ({ isMember, tokens }) => {
    const filteredTokens = React.useMemo(() => {
    return tokens?.reduce((acc = [], cv) => {
      if (Number(cv.fiatBalance) > 0) {
        acc.push(cv)
      }

      return acc
    }, [])
  }, [tokens])

  return (
    <div className="flex flex-col">
      <div className="text-xl py-2 pt-4 font-thin">Treasury</div>
      <div className="grid grid-cols-1 gap-2 py-2 xl:grid-cols-2">
        {filteredTokens?.map((token, i) => (
          <TokenCard token={token} isMember={isMember} key={i} />
        ))}
      </div>
    </div>
  )
}

export default DaoTokensTab
