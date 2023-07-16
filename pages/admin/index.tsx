import type { GetServerSideProps, NextPage } from 'next'
import type { User, Dealer, Transaction } from '../../types/api'
import { parseCookies, destroyCookie } from 'nookies'
import Link from 'next/link'
import { Box, Button, HStack, Heading, Stack, VStack } from '@chakra-ui/react'
import DrawerMenu from '../../components/DrawerMenu'
import Router from 'next/router'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  graphData: GraphData
}

interface JsonedData {
  time_label: number
  outflow: number
}

interface dataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
  yAxisID: string
}

interface GraphData {
  labels: string[]
  datasets: dataset[]
}

const parseDate = (ms_date: number) => {
  const date = new Date(ms_date + 1000*3600*9)
  return `${date.getDate()}日${date.getHours()}時`
}

const Navigation = () => (
  <Stack as="nav">
    <Box rounded="base" fontSize="20px"><Link href="/admin">Edit Money</Link></Box>
    <Box rounded="base" fontSize="20px"><Link href="/admin">Reset User</Link></Box>
    <Box rounded="base" fontSize="20px"><Link href="/admin">Show History</Link></Box>
    <Box rounded="base" fontSize="20px"><Link href="/admin">Settings</Link></Box>
    <Box rounded="base" fontSize="20px"><Link href="/admin">DashBoard</Link></Box>
  </Stack>
)

const Home: NextPage<Props> = ({graphData}) => {
  const options = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
        display: true,
        text: 'Hourly OutFlows',
        },
    }
  }

  return (
      <Stack>
        <HStack background='blue.100'>
          <Box ml="10px"><DrawerMenu><Navigation/></DrawerMenu></Box>
          <Heading width="100wv" marginY="10px" marginLeft="10px">電物カジノ</Heading>
          <Button ml="auto" mr="10px" bgColor="white" onClick={() => {
            destroyCookie(null, "idToken")
            Router.push("/admin/login")
          }}>Logout</Button>
        </HStack>
        <VStack>
          <Bar options={options} data={graphData}></Bar>
        </VStack>
      </Stack>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const idToken = parseCookies(ctx).idToken
  if (!idToken) {
    return {
      redirect: {
        permanent: false,
        destination: '/admin/login'
      }
    }
  }
  const users: User[] = await (await fetch("https://money-manager-api.takatsuki.club/users", {headers: {"Authorization": `Bearer ${idToken}`}})).json()
  const jsonedDatas: JsonedData[] = []
  await Promise.all(users.map(async user => {
    if (user.having_money <= 3000) return
    const tsUser: User = await (await fetch(`https://money-manager-api.takatsuki.club/users/${user.user_id}`)).json()
    tsUser.transaction_history?.forEach(transaction => {
      const roundedTimestamp = Math.floor(Date.parse(transaction.timestamp) / 3600 / 1000) * 3600 * 1000
      if (!jsonedDatas.some(data => data.time_label === roundedTimestamp)) {
        jsonedDatas.push({
          time_label: roundedTimestamp,
          outflow: ["bet", "payment"].includes(transaction.type)? 3000-transaction.amount: transaction.amount-3000,
        })
      } else {
        jsonedDatas[jsonedDatas.findIndex(data => data.time_label === roundedTimestamp)].outflow += ["bet", "payment"].includes(transaction.type)? 3000-transaction.amount: transaction.amount-3000
      }
    })
  }))
  
  
  const graphData: GraphData = {
    labels: [],
    datasets: [
      {
        label: "OutFlows",
        data: [],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        yAxisID: 'y1'
      }
    ]
  }
  jsonedDatas.sort((a, b) => a.time_label < b.time_label ? -1: 1)
  jsonedDatas.forEach(data => {
    graphData.labels.push(parseDate(data.time_label))
    graphData.datasets[0].data.push(data.outflow)
  })

  return {
    props: {
      graphData
    }
  }
}

export default Home
