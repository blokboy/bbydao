import "../styles/globals.css"
import React from "react"
import { Hydrate, QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { ThemeProvider } from "next-themes"
import Layout from "../components/Layout"

function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </Layout>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default MyApp
