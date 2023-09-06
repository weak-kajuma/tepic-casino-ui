import { RepeatClockIcon, Search2Icon } from "@chakra-ui/icons";
import {
    Card,
    CardBody,
    CardHeader,
    Center,
    FormControl,
    HStack,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid,
    Spacer,
    Text,
    VStack,
} from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import { Dealer, endpoint } from "../../types/api";
import { parseCookies } from "nookies";
import axios from "axios";

type StatusShopStatus = {
    shops: Dealer[];
};

const Page: NextPage<StatusShopStatus> = (props) => {
    const [keyword, setKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [shops, setShops] = useState<Dealer[]>(props.shops);

    return (
        <>
            <VStack spacing={5}>
                <Spacer />
                <Center>
                    <HStack>
                        <FormControl>
                            <InputGroup borderRadius={5}>
                                <InputLeftElement>
                                    <Search2Icon color="gray.600" />
                                </InputLeftElement>
                                <Input
                                    width="30vw"
                                    id="keyword"
                                    type="text"
                                    placeholder="検索..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    shadow="md"
                                    bgColor="white"
                                />
                            </InputGroup>
                        </FormControl>
                        <IconButton
                            bgColor="green.400"
                            _hover={{ bgColor: "green.500" }}
                            size="md"
                            icon={<RepeatClockIcon />}
                            isLoading={isLoading}
                            aria-label="Reloading"
                        ></IconButton>
                    </HStack>
                </Center>
                <Spacer />
                <Spacer />
            </VStack>
            <Center>
                <SimpleGrid
                    columns={[1, 2, 3, 4]}
                    spacingX="40px"
                    spacingY="60px"
                >
                    {shops
                        .filter(
                            (e) =>
                                e.name.includes(keyword) ||
                                e.creator.includes(keyword) ||
                                e.description.includes(keyword)
                        )
                        .map((e) => (
                            <ShopItem
                                name={e.name}
                                description={e.description}
                                creator={e.creator}
                                key={e.dealer_id}
                            />
                        ))}
                </SimpleGrid>
            </Center>
        </>
    );
};

export default Page;

export const getServerSideProps: GetServerSideProps<
    StatusShopStatus
> = async () => {
    const shops: Dealer[] = await axios
        .get(`${endpoint}/dealers`)
        .then((res) => res.data);
    return { props: { shops } };
};

const ShopItem = (props: {
    name: string;
    description: string;
    creator: string;
}) => {
    return (
        <Card w={250}>
            <CardHeader>
                <Heading size="md">{props.name}</Heading>
            </CardHeader>
            <CardBody>
                <Text>{props.description}</Text>
                <Text>{`Created by ${props.creator}`}</Text>
            </CardBody>
        </Card>
    );
};
