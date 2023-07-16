import {
    AspectRatio,
    Box,
    Center,
    HStack,
    Heading,
    Spacer,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { IconButton } from "@chakra-ui/button";
import { RepeatClockIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/toast";
import Link from "next/link";
import { GetServerSideProps, NextPage } from "next";

const endpoint = "https://money-manager-api.takatsuki.club";

type StatusRankingProps = {
    users: RankingResponse[];
}

type RankingResponse = {
    rank: number;
    user_id: string;
    nickname: string;
    having_money: number;
};

const Page: NextPage<StatusRankingProps> = (props) => {
    const [rankings, setRankings] = useState(props.users);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();
    useEffect(() => {
        axios.get(endpoint + "/rankings").then((res) => {
            setIsLoading(true);
            setRankings(res.data);
            setIsLoading(false);
        });
    }, []);

    return (
        <Center>
            <VStack spacing={6}>
                <Spacer />
                <HStack spacing={5}>
                    <Heading size={"2xl"}>資産ランキング</Heading>
                    <IconButton
                        bgColor={"white"}
                        size="lg"
                        aria-label="Reloading"
                        icon={<RepeatClockIcon />}
                        isLoading={isLoading}
                        onClick={() => {
                            setIsLoading(true);
                            axios.get(endpoint + "/rankings").then((res) => {
                                setRankings(res.data);
                                toast({
                                    title: "Reloaded!",
                                    status: "success",
                                    position: "bottom-right",
                                });
                                setIsLoading(false);
                            });
                        }}
                    />
                </HStack>
                <VStack spacing={4}>
                    {rankings.map((user: RankingResponse) => (
                        <RankingItem
                            key={user.rank}
                            name={user.nickname}
                            money={user.having_money}
                            rank={user.rank}
                            id={user.user_id}
                        />
                    ))}
                </VStack>
            </VStack>
            <VStack spacing={4}></VStack>
        </Center>
    );
};

const RankingItem = (props: { name: string; money: number; rank: number; id: string }) => {
    let color = "red.50";
    if (props.rank === 1) color = "gold";
    if (props.rank === 2) color = "silver";
    if (props.rank === 3) color = "orange.400";
    return (
        <Link href={`/users?id=${props.id}`} as={`/users?name=${props.name}`}>
        <HStack
            width={"40vw"}
            bgColor={"gray.50"}
            boxShadow="xl"
            rounded="xl"
            p={4}
        >
            <AspectRatio width={"4vh"} ratio={1}>
                <Box bgColor={color} shadow="md" rounded="md">
                    <Text size={"2xl"} color={"gray.900"}>
                        {props.rank}
                    </Text>
                </Box>
            </AspectRatio>

            <Stack>
                <Heading size={"lg"}>{props.name}
                </Heading>
                <Box>
                    <Text size={"2xl"}>{props.money.toLocaleString()} DBC</Text>
                </Box>
            </Stack>
        </HStack>
        </Link>
    );
};

export default Page;

export const getServerSideProps: GetServerSideProps<StatusRankingProps> = async (
    context
) => {
    const users: RankingResponse[] = await axios.get(`${endpoint}/rankings`).then((res) => res.data)

    return { props: { users } };
};
