import { Search2Icon, RepeatClockIcon } from "@chakra-ui/icons";
import {
    useToast,
    VStack,
    Spacer,
    Center,
    HStack,
    FormControl,
    InputGroup,
    InputLeftElement,
    Input,
    IconButton,
    SimpleGrid,
    useDisclosure,
    Card,
    CardHeader,
    Heading,
    CardBody,
    CardFooter,
    Button,
    Text,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalContent,
    ModalBody,
    Box,
    FormLabel,
    ToastId,
    UseToastOptions,
} from "@chakra-ui/react";
import axios from "axios";
import { NextPage, GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useState, useRef, Dispatch, SetStateAction } from "react";
import { Dealer, User, endpoint } from "../../../types/api";

type StatusUserProps = {
    users: User[];
    idToken: string;
};

const Page: NextPage<StatusUserProps> = (props) => {
    const [users, setUsers] = useState<User[]>(props.users);
    const [amo, setAmo] = useState<number>(1);
    const [keyword, setKeyword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

    const toast = useToast();

    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <>
            <VStack spacing={5}>
                <Spacer />
                <Center>
                    <HStack spacing={5}>
                        <FormControl>
                            <InputGroup borderRadius={5}>
                                <InputLeftElement
                                    children={
                                        <Search2Icon color={"gray.600"} />
                                    }
                                />
                                <Input
                                    width={"30vw"}
                                    id="keyword"
                                    type="text"
                                    placeholder="検索..."
                                    onChange={(e) => setKeyword(e.target.value)}
                                    shadow={"md"}
                                    bgColor={"white"}
                                />
                            </InputGroup>
                        </FormControl>
                        <IconButton
                            bgColor={"#949494"}
                            _hover={{ bg: "gray.600" }}
                            size="md"
                            aria-label="Reloading"
                            icon={<RepeatClockIcon />}
                            isLoading={isLoading}
                            onClick={async () => {
                                setIsLoading(true);
                                const headers = {
                                    headers: {
                                        Authorization: `Bearer ${props.idToken}`,
                                    },
                                };
                                axios
                                    .get(`${endpoint}/users`, headers)
                                    .then((res) => {
                                        setUsers(res.data);
                                        setIsLoading(false);
                                        console.log(users);
                                        toast({
                                            title: "Reloaded!",
                                            status: "success",
                                            position: "bottom-right",
                                        });
                                    });
                            }}
                        />
                        <Spacer />
                        <Button
                            colorScheme="green"
                            _hover={{ bg: "green.600" }}
                            size="md"
                            aria-label="Create"
                            onClick={onOpen}
                        >
                            Create
                        </Button>
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>新しいuserを作成</ModalHeader>
                                <ModalBody>
                                    <VStack>
                                        <Box w="full">
                                            <FormLabel htmlFor="name">
                                                Amount
                                            </FormLabel>
                                            <Input
                                                id="email"
                                                type="number"
                                                placeholder="名無しのギャンブラー"
                                                value={amo}
                                                onChange={(e) =>
                                                    setAmo(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </Box>
                                        <Button
                                            background="green.400"
                                            color="white"
                                            _hover={{ background: "green.500" }}
                                            isLoading={isModalLoading}
                                            onClick={async (e) => {
                                                setIsModalLoading(true);
                                                const headers = {
                                                    headers: {
                                                        Authorization: `Bearer ${props.idToken}`,
                                                    },
                                                };
                                                let err: any;
                                                (async () => {
                                                    for await (const _ of Array<number>(
                                                        amo
                                                    )) {
                                                        await axios
                                                            .post(
                                                                `${endpoint}/users`,
                                                                {},
                                                                headers
                                                            )
                                                            .catch((e) => {
                                                                err = e;
                                                            });
                                                    }
                                                })().then(async () => {
                                                    if (err) {
                                                        toast({
                                                            title: "Successed to create",
                                                            status: "error",
                                                            position:
                                                                "bottom-right",
                                                        });
                                                    } else {
                                                        toast({
                                                            title: "Successed to create",
                                                            status: "success",
                                                            position:
                                                                "bottom-right",
                                                        });
                                                    }
                                                    await axios
                                                        .get(
                                                            `${endpoint}/users`,
                                                            headers
                                                        )
                                                        .then((dealers) => {
                                                            if (
                                                                dealers.status ==
                                                                200
                                                            ) {
                                                                setUsers(
                                                                    dealers.data
                                                                );
                                                                toast({
                                                                    title: "Reloaded!",
                                                                    status: "success",
                                                                    position:
                                                                        "bottom-right",
                                                                });
                                                                setIsModalLoading(
                                                                    false
                                                                );
                                                                onClose();
                                                            }
                                                        });
                                                });
                                            }}
                                        >
                                            Create
                                        </Button>
                                    </VStack>
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </HStack>
                </Center>
                <Spacer />
                <Spacer />
            </VStack>
            <Center>
                <SimpleGrid
                    columns={[1, 2, 3, 4]}
                    spacingX={"40px"}
                    spacingY={"60px"}
                >
                    {users
                        .filter(
                            (e) =>
                                e.nickname?.includes(keyword) ||
                                e.user_id?.includes(keyword)
                        )
                        .map((e) => (
                            <ShopItem
                                id={e.user_id}
                                name={e.nickname}
                                key={e.user_id}
                                idToken={props.idToken}
                                setUsers={setUsers}
                                money={e.having_money}
                            />
                        ))}
                </SimpleGrid>
            </Center>
            <Box w="full" h={5} />
        </>
    );
};

export default Page;

export const getServerSideProps: GetServerSideProps<StatusUserProps> = async (
    ctx
) => {
    const idToken = parseCookies(ctx).idToken;
    if (!idToken) {
        return {
            redirect: {
                permanent: false,
                destination: "/admin/login",
            },
        };
    }
    const headers = {
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    };
    const users: User[] = await axios
        .get(`${endpoint}/users`, headers)
        .then((res) => res.data);
    return { props: { users, idToken } };
};

const ShopItem = (props: {
    id: string;
    name: string;
    idToken: string;
    money: number;
    setUsers: Dispatch<SetStateAction<User[]>>;
}) => {
    const [name, setName] = useState<string>(props.name);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        isOpen: isUpdateOpen,
        onOpen: onUpdateOpen,
        onClose: onUpdateClose,
    } = useDisclosure();
    const toast = useToast();

    return (
        <Card width={250}>
            <CardHeader>
                <Heading size={"md"}>{props.name}</Heading>
            </CardHeader>
            <CardBody>
                <Text>{`ID: ${props.id}`}</Text>
                <Text>{`所持金: ${props.money} DBC`}</Text>
            </CardBody>
            <CardFooter>
                <HStack spacing={5}>
                    <Button
                        bgColor={"yellow.400"}
                        shadow={"md"}
                        onClick={onUpdateOpen}
                        _hover={{ bgColor: "yellow.500" }}
                    >
                        Update
                    </Button>
                    <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Update Account</ModalHeader>
                            <ModalBody>
                                <VStack>
                                    <Box w="full">
                                        <FormLabel htmlFor="name">
                                            Name
                                        </FormLabel>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </Box>
                                    <Button
                                        isLoading={isLoading}
                                        bgColor="green.400"
                                        color="white"
                                        _hover={{ bgColor: "green.500" }}
                                        onClick={async () => {
                                            setIsLoading(true);
                                            const headers = {
                                                headers: {
                                                    Authorization: `Bearer ${props.idToken}`,
                                                },
                                            };
                                            await axios
                                                .put(
                                                    `${endpoint}/users/${props.id}/nickname?nickname=${name}`,
                                                    {},
                                                    headers
                                                )
                                                .then(async (res) => {
                                                    if (res.status != 200) {
                                                        toast({
                                                            title: "Failed to update",
                                                            status: "error",
                                                            position:
                                                                "bottom-right",
                                                        });
                                                    } else {
                                                        toast({
                                                            title: "Successed to update",
                                                            status: "success",
                                                            position:
                                                                "bottom-right",
                                                        });
                                                    }
                                                    await axios
                                                        .get(
                                                            `${endpoint}/users`,
                                                            headers
                                                        )
                                                        .then((dealers) => {
                                                            if (
                                                                dealers.status ==
                                                                200
                                                            ) {
                                                                props.setUsers(
                                                                    dealers.data
                                                                );
                                                                setIsLoading(
                                                                    false
                                                                );
                                                                onUpdateClose();
                                                                toast({
                                                                    title: "Reloaded!",
                                                                    status: "success",
                                                                    position:
                                                                        "bottom-right",
                                                                });
                                                            }
                                                        });
                                                });
                                        }}
                                    >
                                        Update
                                    </Button>
                                </VStack>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </HStack>
            </CardFooter>
        </Card>
    );
};
