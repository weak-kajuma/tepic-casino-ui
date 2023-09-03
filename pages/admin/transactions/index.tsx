import { FormControl, Stack, InputGroup, Input, InputRightAddon, InputRightElement, Button, Select, VStack, Heading, Spacer, RadioGroup, Radio, HStack, NumberInput, NumberInputField, NumberDecrementStepper, NumberIncrementStepper, NumberInputStepper, Flex, Slider, SliderFilledTrack, SliderThumb, SliderTrack, InputLeftAddon, useToast } from "@chakra-ui/react"
import { GetServerSideProps, NextPage } from "next"
import { parseCookies } from "nookies"
import { Dealer, endpoint } from "../../../types/api"
import axios from "axios"
import { useState } from "react"
import readQRCode from '../../../utils/popupQrcodeReader';

const Page: NextPage<{dealers: Dealer[]}> = ({dealers}) => {
    const toast = useToast()
    const [dealerId, setDealerId] = useState("")
    const [tsType, setTsType] = useState<"bet" | "payout" | "payment" | "gift" | "other">("bet")
    const [amount, setAmount] = useState(100)
    const [detail, setDetail] = useState(`${tsType.toUpperCase()}-${dealers.filter(j => j.dealer_id === dealerId)[0]?.name}`)

    return (
        <VStack padding="20px">
            <VStack width="80vw" bg="white" padding="20px" borderRadius="10px">
                <Heading m="10px">決済</Heading>
                <FormControl>
                    <Stack spacing={4}>
                        <InputGroup m="auto" size="lg">
                            <Select placeholder='Select Shop' bgColor="white" onChange={e => setDealerId(e.target.value)}>
                                {dealers.map(dealer => (
                                    <option key={dealer.dealer_id} value={dealer.dealer_id}>{dealer.name}</option>
                                ))}
                            </Select>
                        </InputGroup>
                        <InputGroup>
                            <RadioGroup onChange={(e:"bet" | "payout" | "payment" | "gift" | "other") => setTsType(e)}>
                                <Stack direction='row'>
                                    <Radio value='bet' size="lg">Bet</Radio>
                                    <Radio value='payout' size="lg">Payout</Radio>
                                    <Radio value='payment' size="lg">Payment</Radio>
                                    <Radio value='gift' size="lg">Gift</Radio>
                                </Stack>
                            </RadioGroup>
                        </InputGroup>
                        <InputGroup size="lg">
                            <NumberInput step={100} defaultValue={100} min={100} allowMouseWheel onChange={e => setAmount(parseInt(e))}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <InputRightAddon children='DBC'/>
                        </InputGroup>
                        <InputGroup size="lg">
                            <InputLeftAddon children='Details'/>
                            <Input 
                            defaultValue={`${tsType.toUpperCase()}-${dealers.filter(j => j.dealer_id === dealerId)[0]?.name}`}
                            onChange={e => setDetail(e.target.value)}/>
                        </InputGroup>
                    </Stack>
                </FormControl>
                <InputGroup>
                    <Button marginLeft="auto" marginRight="10px" backgroundColor={"gray.100"} onClick={async () => {
                        const user_id = await readQRCode('^https://casino.takatsuki.club/users[?]id=[a-z0-9][a-z0-9][a-z0-9][a-z0-9]&token=')
                        await axios.post(`${endpoint}/transactions`, {
                            user_id: user_id.slice(39,43),
                            dealer_id: dealerId,
                            amount,
                            type: tsType,
                            detail,
                            hide_detail: "nothing"
                        }, {headers: {Authorization: `Bearer ${parseCookies().idToken}`}})
                        toast({
                            title: "Transaction created",
                            description: "決済が完了しました。",
                            status: "success",
                            duration: 5000,
                            isClosable: true
                        })
                    }}>Read QR</Button>
                </InputGroup>
            </VStack>
        </VStack>
    )
}

export const getServerSideProps: GetServerSideProps<{ dealers: Dealer[] }> = async ctx => {
    const idToken = parseCookies(ctx).idToken;
    if (!idToken) {
        return {
            redirect: {
                permanent: false,
                destination: "/admin/login",
            },
        };
    }
    const res = await axios.get(`${endpoint}/dealers`)
    const dealers: Dealer[] = res.data
    return {
        props: {
            dealers
        },
    };
};

export default Page;