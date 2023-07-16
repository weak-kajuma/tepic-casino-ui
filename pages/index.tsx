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

const Page = () => {
    return (
        <>
            <BrowserView>
                <VStack>
                    <SimpleGrid columns={[1,2]} spacing="40px" margin="20px">
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
                                        <Button bgColor={"yellow.400"}>
                                            Click
                                        </Button>
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
                                    <Button bgColor={"purple.400"}>
                                        Click
                                    </Button>
                                </CardFooter>
                            </Card>
                    </SimpleGrid>
                    <Card width={"60%"}>
                        <CardHeader>
                            <Heading size="md">最近の履歴</Heading>
                        </CardHeader>

                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                <TransactionItem
                                    name="Kishida"
                                    amount={150000}
                                />
                                <TransactionItem
                                    name="Biden"
                                    amount={-150000}
                                />
                                <TransactionItem
                                    name="Elon"
                                    amount={-40000000}
                                />
                                <TransactionItem
                                    name="Kudou"
                                    amount={40000000}
                                />
                                <TransactionItem
                                    name="Putin"
                                    amount={-5000000000000000}
                                />
                            </Stack>
                        </CardBody>
                    </Card>
                    <Spacer />
                </VStack>
            </BrowserView>
            <MobileView>
                    <MobileFooter />
            </MobileView>
        </>
    );
};

export default Page;