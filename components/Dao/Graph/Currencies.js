import { FaEthereum } from "react-icons/fa"

const Currencies = [
  {
    name: "ETH",
    icon: <FaEthereum />,
    id: 1,
  },
  {
    name: "USD",
    icon: (
      <img
        src="/icons/currency/us.svg"
        className="m-auto inline-block h-6 w-6"
      />
    ),
    id: 2,
  },
  {
    name: "CAD",
    icon: (
      <img
        src="/icons/currency/ca.svg"
        className="m-auto inline-block h-6 w-6"
      />
    ),
    id: 3,
  },
  {
    name: "JPY",
    icon: (
      <img
        src="/icons/currency/jp.svg"
        className="m-auto inline-block h-6 w-6"
      />
    ),
    id: 4,
  },
]

export default Currencies
