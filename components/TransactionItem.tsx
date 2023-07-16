import { Box, Heading, Text } from "@chakra-ui/react";

export const TransactionItem = (props: { name: string; amount: number }) => {
    let amountString = "± 0";
    let amountColor = "yellow.400";
    if (props.amount > 0) {
        amountString = "+ " + props.amount.toLocaleString();
        amountColor = "green.400";
    }
    if (props.amount < 0) {
        amountString = "- " + Math.abs(props.amount).toLocaleString();
        amountColor = "red.400";
    }
    return (
        <Box bgColor={"white"}>
            <Heading size="xs" textTransform="uppercase">
                {props.name}
            </Heading>
            <Text pt="2" fontSize="sm" color={amountColor}>
                {amountString + " DBC"}
            </Text>
        </Box>
    );
};
