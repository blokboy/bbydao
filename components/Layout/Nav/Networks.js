import { FaEthereum } from "react-icons/fa"

const Networks = [
  {
    name: "ethereum",
    icon: <FaEthereum />,
    id: 1,
  },
  {
    name: "arbitrum",
    icon: (
      <img src="/icons/arbitrum.svg" className="m-auto inline-block h-4 w-4" />
    ),
    id: 42161,
  },
  {
    name: "avalanche",
    icon: <img src="/icons/avax.svg" className="m-auto inline-block h-3 w-4" />,
    id: 43114,
  },
  {
    name: "optimism",
    icon: (
      <img src="/icons/optimism.svg" className="m-auto inline-block h-3 w-4" />
    ),
    id: 10,
  },
  {
    name: "polygon",
    icon: (
      <img src="/icons/polygon.svg" className="m-auto inline-block h-3 w-4" />
    ),
    id: 137,
  },
]

export default Networks
