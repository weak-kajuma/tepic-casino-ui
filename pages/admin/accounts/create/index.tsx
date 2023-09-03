import {
    Center,
    FormControl,
    Heading,
    Input,
    InputGroup,
    Stack,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const Page = () => {
    const [nickname, setNickname] = useState<string>();

    return (
        <>
            <VStack padding="20px" width="80vw">
                <Center>
                    <Heading>Create</Heading>
                    <FormControl>
                        <Stack spacing={4}>
                            <InputGroup>
                                <Input
                                    id="nickname"
                                    type="text"
                                    onChange={(e) =>
                                        setNickname(e.target.value)
                                    }
                                    placeholder="名前を入力(10文字まで）"
                                    maxLength={10}
                                />
                            </InputGroup>
                        </Stack>
                    </FormControl>
                </Center>
            </VStack>
        </>
    );
};

export default Page;
