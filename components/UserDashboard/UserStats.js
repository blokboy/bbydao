import React, { useEffect } from "react"
import { useAccount } from "wagmi"
import { LineChart, PieChart } from "@carbon/charts-react"
import "@carbon/charts/styles-g10.css";


const UserStats = ({ balances, address }) => {
  const [{ data, error, loading }, disconnect] = useAccount()
  const [values, setValues] = React.useState([])

  const formatBalancesForDonut = (balances) => {
    const formattedData = []
    const keys = Object.keys(balances)
    let index = 0;

    for(const key of keys) {
        let total = 0;
        

        const values = balances[key]
        for(const value of values) {
            total += value.balance? Number(value.balance) : 0
        }

        formattedData[index] = { "group": key, "value": (total / (10 ** 18)) }
        index += 1
    }

    return formattedData
  }

  const lineChartData = [
    {
      "group": "Tokens",
      "key": "Day 1",
      "value": 1.42
    },
    {
      "group": "Tokens",
      "key": "Day 2",
      "value": 2.1
    },
    {
      "group": "Tokens",
      "key": "Day 3",
      "value": 1.91
    },
    {
      "group": "Tokens",
      "key": "Day 4",
      "value": 2.35
    },
    {
      "group": "Tokens",
      "key": "Day 5",
      "value": 3
    },
    {
      "group": "Collectibles",
      "key": "Day 1",
      "value": 0.5
    },
    {
      "group": "Collectibles",
      "key": "Day 2",
      "value": 1
    },
    {
      "group": "Collectibles",
      "key": "Day 3",
      "value": 2
    },
    {
      "group": "Collectibles",
      "key": "Day 4",
      "value": 4
    },
    {
      "group": "Collectibles",
      "key": "Day 5",
      "value": 1
    }]

  const lineChartConfig = {
    "title": "BaybDAO Growth",
    "axes": {
      "bottom": {
        "title": "BaybDAO TVL Over Time",
        "mapsTo": "key",
        "scaleType": "labels"
      },
      "left": {
        "mapsTo": "value",
        "title": "ETH",
        "scaleType": "linear"
      }
    },
    "height": "300px",
    "width": "300px",
    "curve": "curveMonotoneX",
    "toolbar": {
        "enabled": false,
        "numberOfIcons": 0
    },
    "tooltip": {
        "enabled": true
    },
    "grid": {
        "x": {
            "enabled": false
        },
        "y": {
            "enabled": false
        }
    },
    "color": {
        "gradient": {
            "colors": ["#0DB2AC","#FC8D4D","#FABA32"],
            "enabled": true
        },
        "pairing": {
            "numberOfVariants": 3,
        }
    }
  }

  const lineChartLoading = {
    "title": "Line (skeleton)",
    "axes": {
      "bottom": {
        "title": "2019 Annual Sales Figures",
        "mapsTo": "date",
        "scaleType": "time"
      },
      "left": {
        "mapsTo": "value",
        "title": "Conversion rate",
        "scaleType": "linear"
      }
    },
    "curve": "curveMonotoneX",
    "data": {
      "loading": true
    },
    "height": "400px"
  }

  const pieChartConfig = {
    "title": "BabyDAO TVL",
    "resizable": true,
    "legend": {
      "alignment": "center"
    },
    "pie": {
      "alignment": "center"
    },
    "height": "300px",
    "width": "300px",
    "toolbar": {
        "enabled": false,
        "numberOfIcons": 0
    },
    "tooltip": {
        "enabled": true
    },
    "color": {
        "gradient": {
            "colors": ["#0DB2AC","#FC8D4D","#FABA32"],
            "enabled": true
        },
        "pairing": {
            "numberOfVariants": 3,
        }
    }
  }

  React.useEffect(() => {
      setValues(formatBalancesForDonut(balances))
  }, [balances])

  return (
    <div className="mt-10 flex flex-col md:mt-0">
      <h1 className="mb-4 pl-10 text-xl font-bold underline">
        {data?.address === address ? "my stats" : "user stats"}
      </h1>
        <PieChart data={values? values : []} options={pieChartConfig}/>
        <br />
    </div>
  )
}

export default UserStats
