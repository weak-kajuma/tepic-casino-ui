import { Button } from "@chakra-ui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/card";
import {
    Flex,
    HStack,
    Heading,
    Link,
    Stack,
    SimpleGrid,
    StackDivider,
    Text,
    VStack,
} from "@chakra-ui/layout";
import { BrowserView, MobileView } from "react-device-detect";
import NextLink from "next/link";
import { TransactionItem } from "../components/TransactionItem";
import { Spacer } from "@chakra-ui/react";
import { MobileFooter } from "../components/MobileFooter";
import { Transaction } from "../types/api";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import readQRCode from "../utils/popupQrcodeReader";
import Router from "next/router";

const endpoint =
    process.env.ENDPOINT ?? "https://money-manager-api.takatsuki.club";

type StatusLatestTransactions = {
    transactions: Transaction[];
};

const Page: NextPage<StatusLatestTransactions> = (props) => {
    const [transactions, setTransactions] = useState<Transaction[]>(
        props.transactions
    );
    const [loadIndex, setLoadIndex] = useState<number>(5);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    const onReadMore = async () => {
        if (loadIndex >= 100) {
            setIsEmpty(true);
        } else {
            setLoadIndex(loadIndex + 5);
        }
    };

    return (
        <>
            <VStack>
                <SimpleGrid columns={[1, 3]} spacing="40px" margin="20px">
                    <Card width={200}>
                        <CardHeader>
                            <Heading size={"md"}>所持金</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text>自分の所持金を確認する</Text>
                        </CardBody>
                        <CardFooter>
                            <Button
                                bgColor={"blue.400"}
                                onClick={async () => {
                                    const qrcode = await readQRCode(
                                        "^https://casino.takatsuki.club/users[?]id=[a-z0-9][a-z0-9][a-z0-9][a-z0-9]&token="
                                    );
                                    Router.push(qrcode);
                                }}
                            >
                                Click
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card width={200}>
                        <CardHeader>
                            <Heading size={"md"}>ランキング</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text>
                                全プレイヤーの所持金ランキングを確認する
                            </Text>
                        </CardBody>
                        <CardFooter>
                            <Link as={NextLink} href="/games/ranking">
                                <Button bgColor={"yellow.400"}>Click</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                    <Card width={200}>
                        <CardHeader>
                            <Heading size={"md"}>店舗</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text>遊べる全ての店舗を確認する</Text>
                        </CardBody>
                        <CardFooter>
                            <Button bgColor={"purple.400"}>Click</Button>
                        </CardFooter>
                    </Card>
                </SimpleGrid>
                <Card width={"60%"}>
                    <CardHeader>
                        <Heading size="md">最近の履歴</Heading>
                    </CardHeader>

                    <CardBody>
                        <Stack divider={<StackDivider />} spacing="4">
                            {transactions.slice(0, loadIndex).map((e) => (
                                <TransactionItem
                                    name={e.nickname}
                                    amount={e.amount}
                                    key={e.transaction_id}
                                />
                            ))}
                        </Stack>
                    </CardBody>
                </Card>
                <Spacer />
                <Card>
                    <Button
                        bgColor={"gray"}
                        _hover={{ bg: "gray.400" }}
                        hidden={isEmpty}
                        onClick={onReadMore}
                    >
                        さらに表示
                    </Button>
                </Card>
            </VStack>
        </>
    );
};

export default Page;

export const getServerSideProps: GetServerSideProps<
    StatusLatestTransactions
> = async () => {
    const transactions: Transaction[] = await fetch(
        `${endpoint}/transactions?limit=100`
    ).then((res) => res.json());

    return { props: { transactions } };
};
