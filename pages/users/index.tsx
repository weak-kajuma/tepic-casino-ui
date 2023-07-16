import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Center,
    HStack,
    Heading,
    Spacer,
    Stack,
    StackDivider,
    VStack,
    useToast,
    Text,
    Icon,
    Tooltip,
    position,
    SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { TransactionItem } from "../../components/TransactionItem";
import { BrowserView } from "react-device-detect";
import { GetServerSideProps, NextPage } from "next";
import { decodeJwt } from "../../utils/decode"
import { EditIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const endpoint = "https://money-manager-api.takatsuki.club";

type UserInfo = {
    user_id: string;
    nickname: string;
    having_money: number;
    rank: number,
    transaction_history: Transaction[];
};

type Transaction = {
    transaction_id: string;
    user_id: string;
    dealer_id: string;
    amount: number;
    type: string;
    detail: string;
    hide_detail: string;
    timestamp: string;
};

type Token = {
    user_id: string,
    exp: number
}

type StatusUserProps = { id: string; data: UserInfo; secure: boolean; token: string };

const Page: NextPage<StatusUserProps> = (props) => {
    const toast = useToast();
    const router = useRouter()
    const { id } = props;

    const [userData, setUserData] = useState<UserInfo>(props.data);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    return (
        <BrowserView>
            <Center>
                <VStack spacing={10}>
                    <Spacer />
                    <Heading>プロフィール</Heading>
                    <Card bgColor={"white"} w={"40vw"}>
                        <CardHeader>
                            <HStack>
                            <Avatar color={"teal.500"} />
                                <Stack>
                                    <Heading color={"gray.700"}>
                                            <HStack>
                                            <Tooltip hasArrow label={`ランキング: ${userData?.rank}位`} placement="top">
                                            <Text>{userData?.nickname}</Text>
                                            </Tooltip>
                                            <EditIcon boxSize={5} onClick={async () => {
                                                if (props.secure) {                                                
                                                    router.push({ pathname: "/users/nickname", query: {
                                                     id: id, token: props.token
                                                    }
                                                }, "/users/nickname")}
                                            }} />
                                            </HStack>
                                    </Heading>
                                    <Text size="md">
                                        現在の所持金 : {userData?.having_money}{" "}
                                        DBC
                                    </Text>
                                    <Text size="md">
                                        {"ID: " + ["****", id][Number(props.secure)]}
                                    </Text>
                                </Stack>
                            </HStack>
                        </CardHeader>
                        <CardFooter>
                            <Button
                                isLoading={isLoading}
                                onClick={async () => {
                                    setIsLoading(true);
                                    try {    
                                    const res = await fetch(`${endpoint}/users/${id}`)
                                    const user: UserInfo = await res.json()
                                    user.transaction_history.reverse()
                                    setUserData(user)
                                    setIsLoading(false)
                                    toast({
                                        title: "Reloaded",
                                        status: "success",
                                        position: "bottom-right"
                                    })
                                    } catch(e) {
                                        setIsLoading(false);
                                       console.error(e)
                                        toast({
                                            title: "Error",
                                            status: "error",
                                            position: "bottom-right"
                                        })
                                    }
                                }}
                                bgColor={"green.300"}
                            >
                                更新する
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card width={"60vw"}>
                        <CardHeader>
                            <Heading size="md">最近の勝負</Heading>
                        </CardHeader>

                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                {userData?.transaction_history.map(
                                    (transaction) => (
                                        <TransactionItem
                                            name={userData?.nickname}
                                            amount={[1, -1][Number(transaction.type === "bet")]*transaction.amount}
                                            key={transaction.transaction_id}
                                        />
                                    )
                                )}
                            </Stack>
                        </CardBody>
                    </Card>
                </VStack>
            </Center>
        </BrowserView>
    );
};

export default Page;

export const getServerSideProps: GetServerSideProps<StatusUserProps> = async (
    context
) => {
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
    const res = await fetch(`${endpoint}/users/${id}`)
    const data: UserInfo = await res.json().catch(() => {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    })

    if (data.user_id !== id) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    }

    data.transaction_history.reverse()

    return { props: { id, data, secure, token } };
};
