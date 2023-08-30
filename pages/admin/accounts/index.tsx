import { GetServerSideProps, NextPage } from "next";
import { User, endpoint } from "../../../types/api";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    FormControl,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    SimpleGrid,
    Spacer,
    VStack,
    Text,
    CardFooter,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    useDisclosure,
    IconButton,
    useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { RepeatClockIcon, Search2Icon } from "@chakra-ui/icons";
import { parseCookies } from "nookies";
import axios from "axios";

type StatusUsersProps = {
    users: User[];
    idToken: string;
};

const Page: NextPage<StatusUsersProps> = (props) => {
    const [users, setUsers] = useState<User[]>(props.users);
    const [keyword, setKeyword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toast = useToast();

    return (
        <>
            <VStack spacing={5}>
                <Spacer />
                <Center>
                    <FormControl>
                        <InputGroup borderRadius={5}>
                            <InputLeftElement
                                children={<Search2Icon color={"gray.600"} />}
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
                            <IconButton
                                bgColor={"#949494"}
                                _hover={{ bg: "gray.300" }}
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
                                            toast({
                                                title: "Reloaded!",
                                                status: "success",
                                                position: "bottom-right",
                                            });
                                        });
                                }}
                            />
                        </InputGroup>
                    </FormControl>
                </Center>
                <Spacer />
                <Spacer />
            </VStack>
            <Center>
                <SimpleGrid columns={[1, 2, 3, 4]} spacingX={"40px"} spacingY={"60px"}>
                    {users
                        .filter(
                            (e) =>
                                e.nickname.includes(keyword) ||
                                e.user_id.includes(keyword)
                        )
                        .map((e) => (
                            <AccountItem
                                name={e.nickname}
                                amount={e.having_money}
                                id={e.user_id}
                                token={props.idToken}
                                key={e.user_id}
                            />
                        ))}
                </SimpleGrid>
            </Center>
        </>
    );
};

export default Page;

export const getServerSideProps: GetServerSideProps<StatusUsersProps> = async (
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

const AccountItem = (props: {
    name: string;
    id: string;
    amount: number;
    token: string;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    return (
        <Card width={250}>
            <CardHeader>
                <Heading size={"md"}>{props.name}</Heading>
            </CardHeader>
            <CardBody>
                <Text>{`ID: ${props.id}`}</Text>
                <Text>{`${props.amount.toLocaleString()} DBC`}</Text>
            </CardBody>
            <CardFooter>
                <Button bgColor={"red.400"} shadow={"md"} onClick={onOpen}>
                    削除
                </Button>
                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader
                                fontSize={"lg"}
                                fontWeight={"bold"}
                            >
                                Delete Account
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    colorScheme="red"
                                    onClick={(e) => {
                                        onClose();
                                        //TODO ここでユーザー削除
                                    }}
                                    ml={3}
                                >
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
};
