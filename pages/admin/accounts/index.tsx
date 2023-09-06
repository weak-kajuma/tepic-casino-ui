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

type UserRes = {
    user_id: string;
    nickname: string;
    having_money: number;
    token: string;
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
                            bgColor="gray.400"
                            _hover={{ bg: "gray.500" }}
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
                                                            .then((res) => {
                                                                const data: UserRes =
                                                                    res.data;
                                                                console.log(
                                                                    data.token
                                                                );
                                                            })
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
    const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const {
        isOpen: isUpdateOpen,
        onOpen: onUpdateOpen,
        onClose: onUpdateClose,
    } = useDisclosure();
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
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
                                            maxLength={10}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </Box>
                                    <HStack>
                                        <Button
                                            isLoading={isUpdateLoading}
                                            bgColor="green.400"
                                            _hover={{ bgColor: "green.500" }}
                                            onClick={async () => {
                                                setIsUpdateLoading(true);
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
                                                            .then((users) => {
                                                                if (
                                                                    users.status ==
                                                                    200
                                                                ) {
                                                                    props.setUsers(
                                                                        users.data
                                                                    );
                                                                    setIsUpdateLoading(
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
                                                    })
                                                    .catch((e) => {
                                                        console.log(e);
                                                        toast({
                                                            title: "Failed to update",
                                                            status: "error",
                                                            position:
                                                                "bottom-right",
                                                        });
                                                        onUpdateClose();
                                                        setIsUpdateLoading(
                                                            false
                                                        );
                                                    });
                                            }}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            bgColor="gray.400"
                                            _hover={{ bgColor: "gray.500" }}
                                            onClick={onUpdateClose}
                                        >
                                            Cancel
                                        </Button>
                                    </HStack>
                                </VStack>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                    <Button
                        bgColor="red.400"
                        _hover={{ bgColor: "red.500" }}
                        onClick={onDeleteOpen}
                    >
                        Delete
                    </Button>
                    <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Delete Account</ModalHeader>
                            <ModalBody>
                                <HStack>
                                    <Button
                                        bgColor="red.400"
                                        _hover={{ bgColor: "red.500" }}
                                        isLoading={isDeleteLoading}
                                        onClick={async () => {
                                            const headers = {
                                                headers: {
                                                    Authorization: `Bearer ${props.idToken}`,
                                                },
                                            };
                                            setIsDeleteLoading(true);
                                            await axios
                                                .delete(
                                                    `${endpoint}/users/${props.id}`,
                                                    headers
                                                )
                                                .then(async (res) => {
                                                    console.log(res);
                                                    if (res.status == 204) {
                                                        toast({
                                                            title: "Successed to delete!",
                                                            status: "success",
                                                            position:
                                                                "bottom-right",
                                                        });
                                                        await axios
                                                            .get(
                                                                `${endpoint}/users`,
                                                                headers
                                                            )
                                                            .then((users) => {
                                                                if (
                                                                    users.status ==
                                                                    200
                                                                ) {
                                                                    props.setUsers(
                                                                        users.data
                                                                    );
                                                                    toast({
                                                                        title: "Reloaded!",
                                                                        status: "success",
                                                                        position:
                                                                            "bottom-right",
                                                                    });
                                                                }
                                                            });
                                                    } else {
                                                        toast({
                                                            title: "Failed to delete!",
                                                            status: "error",
                                                            position:
                                                                "bottom-right",
                                                        });
                                                    }
                                                    setIsDeleteLoading(false);
                                                    onDeleteClose();
                                                });
                                        }}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        bgColor="gray.400"
                                        _hover={{ bgColor: "gray.500" }}
                                        onClick={onDeleteClose}
                                    >
                                        Cancel
                                    </Button>
                                </HStack>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </HStack>
            </CardFooter>
        </Card>
    );
};
