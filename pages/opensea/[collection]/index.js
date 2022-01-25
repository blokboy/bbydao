import React from "react"
import OpenSeaCollection from "components/OpenSeaCollection"

const OpenSeaPage = ({ data }) => {
  return <OpenSeaCollection data={data} />
}

export default OpenSeaPage

OpenSeaPage.getInitialProps = async ({ query }) => {
  // query.slug to fetch collection from os api

  const doodles = {
    address: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
    asset_contract_type: "non-fungible",
    banner_image_url:
      "https://lh3.googleusercontent.com/svc_rQkHVGf3aMI14v3pN-ZTI7uDRwN-QayvixX-nHSMZBgb1L1LReSg1-rXj4gNLJgAB0-yD8ERoT-Q2Gu4cy5AuSg-RdHF9bOxFDw=s2500",
    created_date: "2021-10-16T16:25:03.736944",
    description:
      "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
    name: "Doodles",
    schema_name: "ERC721",
    image_url:
      "https://lh3.googleusercontent.com/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ=s120",
    hidden: false,
    safelist_request_status: "verified",
    is_subject_to_whitelist: false,
    slug: "doodles-official",
    one_day_volume: 286.81499999999994,
    one_day_change: -0.21148109261890896,
    one_day_sales: 27.0,
    one_day_average_price: 10.622777777777776,
    seven_day_volume: 3218.8711,
    seven_day_change: -0.7250845826616862,
    seven_day_sales: 242.0,
    thirty_day_volume: 31689.427588500606,
    thirty_day_change: 3.150249645413829,
    thirty_day_sales: 3096.0,
    thirty_day_average_price: 10.235603226259887,
    total_volume: 62668.09637530459,
    total_sales: 18028.0,
    total_supply: 9999.0,
    count: 9999.0,
    num_owners: 5803,
    average_price: 3.4761535597572992,
    market_cap: 132997.9013590909,
    floor_price: 9.2,
  }

  return { data: doodles }
}
