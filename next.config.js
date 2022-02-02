module.exports = {
  reactStrictMode: true,
  env: {
    accounts_api: process.env.ACCOUNTS_API,
    dao: process.env.dao,
    OPENSEA_API: process.env.OPENSEA_API,
  },
  images: {
    domains: ["cloudflare-ipfs.com"],
  },
}
