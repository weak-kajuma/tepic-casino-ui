import { CheckCircleIcon } from "@chakra-ui/icons"
import { Box, Center, Container, VStack } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const Page = () => {

    const [sec, setSec] = useState<number>(3000000)
    const router = useRouter()

    useEffect(() => {
        const id = setInterval(() => {
            setSec(sec - 1)
            if (sec === 1) {
                router.push("/")
            }
        }, 1000)
        return () => clearInterval(id)
    }, [sec])

    return (
        <>
        <Box  h={"full"}>
            <Center h={"70vh"}>
                <VStack justify={"center"}>
                <CheckCircleIcon color={"green"} boxSize={"50%"}/>
                <p>{sec}秒後にリダイレクトします</p>
                </VStack>
            </Center>
        </Box>
        </>
    )
}

export default Page