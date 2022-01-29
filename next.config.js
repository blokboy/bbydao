module.exports = {
  reactStrictMode: true,
  env: {
    accounts_api: process.env.ACCOUNTS_API,
    dao: process.env.dao,
  },
  images: {
    domains: ["cloudflare-ipfs.com"],
  },
}
