import { Box, Flex, HStack, Heading, Spacer, Text } from "@chakra-ui/react";

export const TransactionItem = (props: {
    name: string;
    amount: number;
    type: string;
    time: string;
}) => {
    let amountString = "± 0";
    let amountColor = "yellow.400";
    if (props.type == "payment" || props.type == "bet") {
        amountString = "- " + Math.abs(props.amount).toLocaleString();
        amountColor = "red.400";
    } else {
        amountString = "+ " + props.amount.toLocaleString();
        amountColor = "green.400";
    }

    const d = new Date(props.time);
    d.setTime(d.getTime() + 9 * 60 * 60 * 1000);

    return (
        <Box bgColor={"white"}>
            <Heading size="xs">{props.name}</Heading>
            <Flex>
                <Text pt="2" fontSize="sm" color={amountColor}>
                    {amountString + " DBC"}
                </Text>
                <Spacer />
                <Text pt="2" size="sm" color="gray.600">
                    {d.getHours().toString().padStart(2, "0") +
                        ":" +
                        d.getMinutes().toString().padStart(2, "0")}
                </Text>
            </Flex>
        </Box>
    );
};
