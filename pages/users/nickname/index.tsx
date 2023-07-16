import { Button, Card, Center, HStack, Heading, Input, InputGroup, Spacer, VStack, useToast } from "@chakra-ui/react"
import { GetServerSideProps, NextPage } from "next";
import { decodeJwt } from "../../../utils/decode";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

type StatusNickStatus = {
    id: string;
    token: string;
    secure: boolean
}

type Token = {
    user_id: string;
    exp: number;
}

const endpoint = "https://money-manager-api.takatsuki.club"

const Page: NextPage<StatusNickStatus> = (props) => {
    const [name, setName] = useState<string>("")
    const toast = useToast()
    const router = useRouter()

    return (
        <Center>
            <VStack spacing={4}>
                <Spacer/>
                <Heading>ユーザー名変更</Heading>
                <Card backgroundColor={"white"} padding={"10"}>
                    <VStack spacing={4}>
                        <HStack spacing={10}>
                           <InputGroup size={"md"} w={"40vw"}>
                                <Input maxLength={10} placeholder="ユーザー名を入力（10文字まで）" color={"gray"} backgroundColor={"white"} onChange={(e) => setName(e.target.value)}/>
                            </InputGroup>
                            <Button size={"sm"} w={"4rem"} h={"2.25rem"} color={"white"} backgroundColor={"green.400"} onClick={async (e) => {
                                try {
                                    if (!props.secure) throw new Error()
                                    const headers = { headers: { Authorization: `Bearer ${props.token}` }};
                                    axios.put(`${endpoint}/users/${props.id}/nickname?nickname=${name}`,{}, headers).then(() => router.push("/"))
                                } catch(e) {
                                    console.error(e)
                                    toast({
                                        title: "Error",
                                        status: "error",
                                        position: "bottom-right"
                                    })
                                }
                            } }>
                                変更する
                            </Button>
                        </HStack>
                        <Spacer/>
                    </VStack>
                </Card>
            </VStack>
        </Center>
    )
}

export default Page

export const getServerSideProps: GetServerSideProps<StatusNickStatus> = async (context) => {
    let { id } = context.query;
    let { token } = context.query
    let secure = false
    if (typeof token === "string" && typeof token !== "undefined") {
        const decrypted: Token = decodeJwt(token)
        if (decrypted.user_id === id) {
            secure = true
        }
    } else {
        token = ""
    }

    if (typeof id !== "string") {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    }
    return { props: { id, token, secure}}
}