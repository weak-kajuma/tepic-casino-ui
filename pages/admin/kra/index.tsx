import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Heading,
    SimpleGrid,
    VStack,
    Text,
    useDisclosure,
    ModalOverlay,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Box,
    FormLabel,
    InputGroup,
    Select,
    HStack,
    FormControl,
    FormErrorMessage,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Circle,
    isStyleProp,
    Center,
    FlexProps,
    Spacer,
    Container,
    InputRightAddon,
} from "@chakra-ui/react";
import axios from "axios";
import { useForceUpdate } from "framer-motion";
import { NextPage, GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useState } from "react";
import { FormationTicket, KraEndpoint, Ticket } from "../../../utils/KRA";
import readQRCode from "../../../utils/popupQrcodeReader";

interface ModalTicketOption {
    name: string;
    value: string;
}
const BOX: ModalTicketOption = { name: "ボックス", value: "BOX" };
const WHEEL: ModalTicketOption = { name: "総流し", value: "WHEEL" };
const WHEEL_FIRST: ModalTicketOption = {
    name: "1着固定流し",
    value: "WHEEL_FIRST",
};
const WHEEL_SECOND: ModalTicketOption = {
    name: "2着固定流し",
    value: "WHEEL_SECOND",
};
const WHEEL_TO_SECOND: ModalTicketOption = {
    name: "1・2着固定流し",
    value: "WHEEL_TO_SECOND",
};

const Page: NextPage = () => {
    const {
        isOpen: isNormalOpen,
        onOpen: onNormalOpen,
        onClose: onNormalClose,
    } = useDisclosure();
    const {
        isOpen: isFormOpen,
        onOpen: onFormOpen,
        onClose: onFormClose,
    } = useDisclosure();

    const [raceId, setRaceId] = useState<number | void>();
    const [amount, setAmount] = useState<number | void>(); //amount of horses
    const [defRaceId, setDefRaceId] = useState(raceId);
    const [defAmount, setDefAmount] = useState(amount);

    return (
        <VStack>
            <Spacer />
            <HStack>
                <Input
                    value={raceId ? raceId : ""}
                    placeholder="レースID"
                    w="full"
                    bgColor="white"
                    onChange={(e) => {
                        const p = parseInt(e.target.value);
                        if (Number.isNaN(p)) return setRaceId();
                        return setRaceId(p);
                    }}
                />
                <Input
                    value={amount ? amount : ""}
                    placeholder="頭数"
                    w="full"
                    bgColor="white"
                    onChange={(e) => {
                        const p = parseInt(e.target.value);
                        if (Number.isNaN(p)) return setAmount();
                        return setAmount(p);
                    }}
                />
                <Button
                    bgColor="green.400"
                    _hover={{ bgColor: "green.500" }}
                    onClick={(e) => {
                        setDefRaceId(raceId);
                        setDefAmount(amount);
                    }}
                >
                    Set
                </Button>
            </HStack>
            <SimpleGrid columns={[1, 3]} spacing="40px" margin="20px">
                <Card width={200}>
                    <CardHeader>
                        <Heading size={"md"}>Result</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>レースリザルトを送信</Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            bgColor={"yellow.400"}
                            _hover={{ bgColor: "yellow.500" }}
                            onClick={async () => {}}
                        >
                            Send
                        </Button>
                    </CardFooter>
                </Card>
                <Card width={200}>
                    <CardHeader>
                        <Heading size={"md"}>Ticket</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>馬券を作成</Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            bgColor={"blue.400"}
                            _hover={{ bgColor: "blue.500" }}
                            onClick={onNormalOpen}
                        >
                            Create
                        </Button>
                    </CardFooter>
                </Card>
                <Card width={200}>
                    <CardHeader>
                        <Heading size={"md"}>Ticket</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>馬券を作成(フォーメーション)</Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            bgColor={"cyan.400"}
                            _hover={{ bgColor: "cyan.500" }}
                            onClick={onFormOpen}
                        >
                            Create
                        </Button>
                    </CardFooter>
                </Card>
            </SimpleGrid>
            <NormalModal
                isOpen={isNormalOpen}
                onOpen={onNormalOpen}
                onClose={onNormalClose}
                amount={defAmount ? defAmount : 12}
                id={defRaceId ? defRaceId : 1}
            />
            <FormationModal
                isOpen={isFormOpen}
                onOpen={onFormOpen}
                onClose={onFormClose}
                amount={defAmount ? defAmount : 12}
                id={defRaceId ? defRaceId : 1}
            />
        </VStack>
    );
};

export default Page;

export const getServerSideProps: GetServerSideProps<{ hoge: null }> = async (
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
    return {
        props: {
            hoge: null,
        },
    };
};

const NormalModal = (props: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    amount: number;
    id: number;
}) => {
    const [type, setType] = useState("");
    const [option, setOption] = useState("");
    const [bet, setBet] = useState(0);

    const [first, setFirst] = useState<boolean[]>(Array(12).fill(false));
    const [second, setSecond] = useState<boolean[]>(Array(12).fill(false));
    const [third, setThird] = useState<boolean[]>(Array(12).fill(false));
    const changeFirst = (h: number, place: number) => {
        const copy = [first, second, third][place];
        copy[h - 1] = copy[h - 1] ? false : true;
        [setFirst, setSecond, setThird][place](copy);
        console.log([first, second, third][place]);
    };

    const resetHorse = (): void => {
        setFirst(Array(12).fill(false));
        setSecond(Array(12).fill(false));
        setThird(Array(12).fill(false));
    };

    const getHorseNumber = (place: number): number[] => {
        let horse: number[] = [];
        [first, second, third][place].forEach((h, i) => {
            if (h) horse.push(i + 1);
        });
        return horse;
    };

    const getAllHorseNumber: number[] = [
        ...getHorseNumber(0),
        ...getHorseNumber(1),
        ...getHorseNumber(2),
    ];
    const [update] = useForceUpdate();

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a ticket</ModalHeader>
                <ModalBody>
                    <VStack>
                        <FormControl isInvalid={true}>
                            <FormLabel>Ticket Type</FormLabel>
                            <InputGroup>
                                <Select
                                    placeholder="Select Type"
                                    bgColor="white"
                                    onChange={(e) => {
                                        setType(e.target.value);
                                        setOption("");
                                        resetHorse();
                                    }}
                                    value={type}
                                >
                                    <TypeItem v="単勝" />
                                    <TypeItem v="複勝" />
                                    <TypeItem v="馬連" />
                                    <TypeItem v="馬単" />
                                    <TypeItem v="ワイド" />
                                    <TypeItem v="三連複" />
                                    <TypeItem v="三連単" />
                                </Select>
                            </InputGroup>
                            <FormErrorMessage>
                                {type == "" ? "Typeを選択" : "　"}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Ticket Option</FormLabel>
                            <InputGroup>
                                <Select
                                    placeholder="Select Option"
                                    bgColor="white"
                                    onChange={(e) => {
                                        setOption(e.target.value);
                                        resetHorse();
                                    }}
                                    value={option}
                                >
                                    <AllOptionItem v={type} />
                                </Select>
                            </InputGroup>
                            <Text>　</Text>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Bet額を指定</FormLabel>
                            <NumberInput
                                step={100}
                                value={bet}
                                onChange={(e) => {
                                    const p = parseInt(e);
                                    if (Number.isNaN(p)) return setBet(0);
                                    return setBet(p);
                                }}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <FormControl>
                            <Container hidden={option == "WHEEL_SECOND"}>
                                <Spacer height={5} />
                                <FormLabel>1着を選択</FormLabel>
                                <Center>
                                    <SimpleGrid columns={[1, 6]} spacing={5}>
                                        {first.map((b, i) => (
                                            <HorseButton
                                                isSelect={b}
                                                n={i + 1}
                                                key={i}
                                                onClick={() => {
                                                    changeFirst(i + 1, 0);
                                                    update();
                                                }}
                                            />
                                        ))}
                                    </SimpleGrid>
                                </Center>
                            </Container>
                            <Container
                                hidden={
                                    !(
                                        type == "ワイド" ||
                                        type == "馬連" ||
                                        type == "馬単" ||
                                        type == "三連複" ||
                                        type == "三連単"
                                    ) ||
                                    option == "WHEEL" ||
                                    option == "WHEEL_FIRST"
                                }
                            >
                                <Spacer height={5} />
                                <FormLabel>2着を選択</FormLabel>
                                <Center>
                                    <SimpleGrid columns={[1, 6]} spacing={5}>
                                        {second.map((b, i) => (
                                            <HorseButton
                                                isSelect={b}
                                                n={i + 1}
                                                key={i}
                                                onClick={() => {
                                                    changeFirst(i + 1, 1);
                                                    update();
                                                }}
                                            />
                                        ))}
                                    </SimpleGrid>
                                </Center>
                            </Container>
                            <Container
                                hidden={!(type == "三連複" || type == "三連単")}
                            >
                                <Spacer height={5} />
                                <FormLabel>3着を選択</FormLabel>
                                <Center>
                                    <SimpleGrid columns={[1, 6]} spacing={5}>
                                        {third.map((b, i) => (
                                            <HorseButton
                                                isSelect={b}
                                                n={i + 1}
                                                key={i}
                                                onClick={() => {
                                                    changeFirst(i + 1, 2);
                                                    update();
                                                }}
                                            />
                                        ))}
                                    </SimpleGrid>
                                </Center>
                            </Container>
                        </FormControl>
                        <HStack>
                            ß
                            <Button
                                bgColor="gray.400"
                                _hover={{ bgColor: "gray.500" }}
                                onClick={() => {
                                    props.onClose();
                                }}
                                w="50%"
                            >
                                Cancel
                            </Button>
                            <Button
                                bgColor="blue.400"
                                _hover={{ bgColor: "blue.500" }}
                                onClick={async () => {
                                    if (type === "") return;
                                    props.onClose();
                                    const user_id = await readQRCode(
                                        "^https://casino.takatsuki.club/users[?]id=[a-z0-9][a-z0-9][a-z0-9][a-z0-9]&token="
                                    ).then((res) => res.slice(39, 43));
                                    const ticket: Ticket = {
                                        user_id: user_id,
                                        horse: getAllHorseNumber,
                                        type: type,
                                        option: option ? option : "NO",
                                        optNum: props.amount,
                                        bet: bet,
                                        race: props.id,
                                    };
                                    console.log(ticket);
                                    await axios
                                        .post(
                                            `${KraEndpoint}/ticket/add`,
                                            ticket
                                        )
                                        .then((res) => console.log(res));
                                }}
                                w="50%"
                            >
                                Send
                            </Button>
                        </HStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const FormationModal = (props: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    amount: number;
    id: number;
}) => {
    const [type, setType] = useState("馬単");
    const [bet, setBet] = useState(0);

    const [first, setFirst] = useState<boolean[]>(Array(12).fill(false));
    const [second, setSecond] = useState<boolean[]>(Array(12).fill(false));
    const [third, setThird] = useState<boolean[]>(Array(12).fill(false));
    const changeFirst = (h: number, place: number) => {
        const copy = [first, second, third][place];
        copy[h - 1] = copy[h - 1] ? false : true;
        [setFirst, setSecond, setThird][place](copy);
    };

    const getHorseNumber = (place: number): number[] => {
        let horse: number[] = [];
        [first, second, third][place].forEach((h, i) => {
            if (h) horse.push(i + 1);
        });
        return horse;
    };

    const getAllHorseNumber: number[] = [
        ...getHorseNumber(0),
        ...getHorseNumber(1),
        ...getHorseNumber(2),
    ];

    const [update] = useForceUpdate();

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a ticket (Formation)</ModalHeader>
                <ModalBody>
                    <VStack>
                        <FormControl isInvalid={true}>
                            <FormLabel>Ticket Type</FormLabel>
                            <InputGroup>
                                <Select
                                    placeholder="Select Type"
                                    bgColor="white"
                                    onChange={(e) => setType(e.target.value)}
                                    value={type}
                                >
                                    <TypeItem v="馬単" />
                                    <TypeItem v="三連単" />
                                </Select>
                            </InputGroup>
                            <FormErrorMessage>
                                {type == "" ? "Typeを選択" : "　"}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Bet額を指定</FormLabel>
                            <NumberInput
                                step={100}
                                value={bet}
                                onChange={(e) => {
                                    const p = parseInt(e);
                                    if (Number.isNaN(p)) return setBet(0);
                                    return setBet(p);
                                }}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <FormControl>
                            <Container>
                                <Spacer height={5} />
                                <FormLabel>1着を選択</FormLabel>
                                <Center>
                                    <SimpleGrid columns={[1, 6]} spacing={5}>
                                        {first.map((b, i) => (
                                            <HorseButton
                                                isSelect={b}
                                                n={i + 1}
                                                key={i}
                                                onClick={() => {
                                                    changeFirst(i + 1, 0);
                                                    update();
                                                }}
                                            />
                                        ))}
                                    </SimpleGrid>
                                </Center>
                            </Container>
                            <Container
                                hidden={!(type == "馬単" || type == "三連単")}
                            >
                                <Spacer height={5} />
                                <FormLabel>2着を選択</FormLabel>
                                <Center>
                                    <SimpleGrid columns={[1, 6]} spacing={5}>
                                        {second.map((b, i) => (
                                            <HorseButton
                                                isSelect={b}
                                                n={i + 1}
                                                key={i}
                                                onClick={() => {
                                                    changeFirst(i + 1, 1);
                                                    update();
                                                }}
                                            />
                                        ))}
                                    </SimpleGrid>
                                </Center>
                            </Container>
                            <Container hidden={!(type == "三連単")}>
                                <Spacer height={5} />
                                <FormLabel>3着を選択</FormLabel>
                                <Center>
                                    <SimpleGrid columns={[1, 6]} spacing={5}>
                                        {third.map((b, i) => (
                                            <HorseButton
                                                isSelect={b}
                                                n={i + 1}
                                                key={i}
                                                onClick={() => {
                                                    changeFirst(i + 1, 2);
                                                    update();
                                                }}
                                            />
                                        ))}
                                    </SimpleGrid>
                                </Center>
                            </Container>
                        </FormControl>
                        <HStack>
                            ß
                            <Button
                                bgColor="gray.400"
                                _hover={{ bgColor: "gray.500" }}
                                onClick={props.onClose}
                                w="50%"
                            >
                                Cancel
                            </Button>
                            <Button
                                bgColor="blue.400"
                                _hover={{ bgColor: "blue.500" }}
                                onClick={async () => {
                                    if (type === "") return;
                                    const user_id = await readQRCode(
                                        "^https://casino.takatsuki.club/users[?]id=[a-z0-9][a-z0-9][a-z0-9][a-z0-9]&token="
                                    ).then((res) => res.slice(39, 43));
                                    const ticket: FormationTicket = {
                                        user_id: user_id,
                                        f: getHorseNumber(0),
                                        s: getHorseNumber(1),
                                        t: getHorseNumber(2),
                                        type: type,
                                        option: "NO",
                                        optNum: props.amount,
                                        bet: bet,
                                        race: props.id,
                                    };
                                    await axios.post(
                                        `${KraEndpoint}/ticket/add/formation`,
                                        ticket
                                    );
                                    props.onClose();
                                }}
                                w="50%"
                            >
                                Send
                            </Button>
                        </HStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

interface HorseButtonProps extends FlexProps {
    isSelect: boolean;
    n: number;
}

const HorseButton = ({ isSelect, n, ...rest }: HorseButtonProps) => {
    if (isSelect) {
        return (
            <Circle
                bg="green.600"
                color="gray.200"
                borderColor="green"
                border="5px"
                borderRadius="2px"
                size="40px"
                fontSize="20px"
                _hover={{ bgColor: "green.700" }}
                {...rest}
            >
                <Text>{n}</Text>
            </Circle>
        );
    }
    return (
        <Circle
            bg="gray.200"
            color="black"
            borderRadius="2px"
            size="40px"
            fontSize="20px"
            _hover={{ bgColor: "gray.300" }}
            {...rest}
        >
            <Text>{n}</Text>
        </Circle>
    );
};

const TypeItem = (props: { v: string }) => {
    return (
        <option key={props.v} value={props.v}>
            {props.v}
        </option>
    );
};

const OptionItem = (props: { opt: ModalTicketOption }) => {
    return (
        <option key={props.opt.value} value={props.opt.value}>
            {props.opt.name}
        </option>
    );
};

const AllOptionItem = (props: { v: string }) => {
    const type = props.v;
    if (type == "単勝" || type == "複勝") return <></>;
    if (type == "馬連")
        return (
            <>
                <OptionItem opt={BOX} />
                <OptionItem opt={WHEEL} />
            </>
        );
    if (type == "馬単")
        return (
            <>
                <OptionItem opt={BOX} />
                <OptionItem opt={WHEEL_FIRST} />
                <OptionItem opt={WHEEL_SECOND} />
            </>
        );
    if (type == "ワイド")
        return (
            <>
                <OptionItem opt={BOX} />
                <OptionItem opt={WHEEL} />
            </>
        );
    if (type == "三連複")
        return (
            <>
                <OptionItem opt={BOX} />
            </>
        );
    if (type == "三連単")
        return (
            <>
                <OptionItem opt={BOX} />
                <OptionItem opt={WHEEL_FIRST} />
                <OptionItem opt={WHEEL_SECOND} />
                <OptionItem opt={WHEEL_TO_SECOND} />
            </>
        );
};
