import Messages from "components/Messages"
import { useConnect } from "wagmi"
import axios from "axios"

const Index = ({ data }) => {
  const [{ data: connectData, error, loading }, connect] = useConnect()
  console.log('data ', data);
  return <Messages data={data}/>
}

export default Index

export const getServerSideProps = async ({ query }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API}/member/threads`,
      {
        address: query.address,
      }
    )
    console.log('res ', res);
    const threads = res.data


    return { props: { data: { threads } } }
  } catch (error) {
    // return error
    console.log(error);
  }
}
