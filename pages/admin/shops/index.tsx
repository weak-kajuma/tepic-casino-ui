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
import { Dealer, endpoint } from "../../../types/api";

type StatusShopsProps = {
    shops: Dealer[];
    idToken: string;
};

const Page: NextPage<StatusShopsProps> = (props) => {
    const [shops, setShops] = useState<Dealer[]>(props.shops);
    const [keyword, setKeyword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [name, setName] = useState<string>("名無しのお店");
    const [description, setDescription] =
        useState<string>("法を度外視した商売をしている");
    const [creator, setCreator] = useState<string>("山本太郎");
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
                                    .get(`${endpoint}/dealers`, headers)
                                    .then((res) => {
                                        setShops(res.data);
                                        setIsLoading(false);
                                        console.log(shops);
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
                                <ModalHeader>新しいshopを作成</ModalHeader>
                                <ModalBody>
                                    <VStack>
                                        <Box w="full">
                                            <FormLabel htmlFor="name">
                                                Name
                                            </FormLabel>
                                            <Input
                                                id="email"
                                                type="text"
                                                placeholder="名無しのお店"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                            />
                                        </Box>
                                        <Box w="full">
                                            <FormLabel htmlFor="description">
                                                Description
                                            </FormLabel>
                                            <Input
                                                id="description"
                                                type="text"
                                                placeholder="法を度外視した商売をしている"
                                                value={description}
                                                onChange={(e) =>
                                                    setDescription(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Box>
                                        <Box w="full">
                                            <FormLabel htmlFor="creator">
                                                Creator
                                            </FormLabel>
                                            <Input
                                                id="creator"
                                                type="text"
                                                placeholder="山本太郎"
                                                value={creator}
                                                onChange={(e) =>
                                                    setCreator(e.target.value)
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
                                                const token = props.idToken;
                                                const headers = {
                                                    headers: {
                                                        Authorization: `Bearer ${token}`,
                                                    },
                                                };
                                                const body = {
                                                    name: name,
                                                    description: description,
                                                    creator: creator,
                                                };
                                                await axios
                                                    .post(
                                                        `${endpoint}/dealers`,
                                                        body,
                                                        headers
                                                    )
                                                    .then(async (res) => {
                                                        if (res.status != 200) {
                                                            toast({
                                                                title: "Failed to create",
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
                                                                `${endpoint}/dealers`,
                                                                headers
                                                            )
                                                            .then((dealers) => {
                                                                if (
                                                                    dealers.status ==
                                                                    200
                                                                ) {
                                                                    setShops(
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
                    {shops
                        .filter(
                            (e) =>
                                e.name?.includes(keyword) ||
                                e.dealer_id?.includes(keyword) ||
                                e.creator?.includes(keyword) ||
                                e.description?.includes(keyword)
                        )
                        .map((e) => (
                            <ShopItem
                                id={e.dealer_id}
                                name={e.name}
                                description={e.description}
                                creator={e.creator}
                                key={e.dealer_id}
                                token={props.idToken}
                                setShops={setShops}
                            />
                        ))}
                </SimpleGrid>
            </Center>
            <Box w="full" h={5} />
        </>
    );
};

export default Page;

export const getServerSideProps: GetServerSideProps<StatusShopsProps> = async (
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
    const shops: Dealer[] = await axios
        .get(`${endpoint}/dealers`, headers)
        .then((res) => res.data);
    return { props: { shops, idToken } };
};

const ShopItem = (props: {
    id: string;
    name: string;
    description: string;
    creator: string;
    token: string;
    setShops: Dispatch<SetStateAction<Dealer[]>>;
}) => {
    const [name, setName] = useState<string>(props.name);
    const [description, setDescription] = useState<string>(props.description);
    const [creator, setCreator] = useState<string>(props.creator);
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
        <Card width={300}>
            <CardHeader>
                <Heading size={"md"}>{props.name}</Heading>
            </CardHeader>
            <CardBody>
                <Text>{`ID: ${props.id}`}</Text>
                <Text>{`Created by ${props.creator}`}</Text>
                <br />
                <Text>{props.description}</Text>
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
                            <ModalHeader>Update Shop</ModalHeader>
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
                                    <Box w="full">
                                        <FormLabel htmlFor="description">
                                            Description
                                        </FormLabel>
                                        <Input
                                            id="description"
                                            type="text"
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                        />
                                    </Box>
                                    <Box w="full">
                                        <FormLabel htmlFor="creator">
                                            Creator
                                        </FormLabel>
                                        <Input
                                            id="creator"
                                            type="text"
                                            value={creator}
                                            onChange={(e) =>
                                                setCreator(e.target.value)
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
                                                    Authorization: `Bearer ${props.token}`,
                                                },
                                            };
                                            const body = {
                                                name: name,
                                                description: description,
                                                creator: creator,
                                            };
                                            await axios
                                                .put(
                                                    `${endpoint}/dealers/${props.id}`,
                                                    body,
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
                                                            `${endpoint}/dealers`,
                                                            headers
                                                        )
                                                        .then((dealers) => {
                                                            if (
                                                                dealers.status ==
                                                                200
                                                            ) {
                                                                props.setShops(
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
                    <Button
                        bgColor={"red.400"}
                        shadow={"md"}
                        onClick={onDeleteOpen}
                        _hover={{ bgColor: "red.500" }}
                    >
                        Delete
                    </Button>
                    <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Delete Shop</ModalHeader>
                            <ModalBody>
                                <HStack spacing={5}>
                                    <Button
                                        bgColor="red.400"
                                        _hover={{ bgColor: "red.500" }}
                                        isLoading={isDeleteLoading}
                                        onClick={async () => {
                                            setIsDeleteLoading(true);
                                            const headers = {
                                                headers: {
                                                    Authorization: `Bearer ${props.token}`,
                                                },
                                            };
                                            await axios
                                                .delete(
                                                    `${endpoint}/dealers/${props.id}`,
                                                    headers
                                                )
                                                .then(async () => {
                                                    toast({
                                                        title: "Successed to delete the shop!",
                                                        status: "success",
                                                        position:
                                                            "bottom-right",
                                                    });
                                                    await axios
                                                        .get(
                                                            `${endpoint}/dealers`,
                                                            headers
                                                        )
                                                        .then((res) => {
                                                            if (
                                                                res.status ==
                                                                200
                                                            ) {
                                                                props.setShops(
                                                                    res.data
                                                                );
                                                                setIsDeleteLoading(
                                                                    false
                                                                );
                                                                onDeleteClose();
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
                                        Delete
                                    </Button>
                                    <Button
                                        bgColor="gray.400"
                                        _hover={{ bgColor: "gray.500" }}
                                        onClick={() => {
                                            onDeleteClose();
                                        }}
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
