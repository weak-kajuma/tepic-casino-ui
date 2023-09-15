import { Button, VStack, Spacer, SimpleGrid } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";

const Page: NextPage = () => {
    const router = useRouter();

    return (
        <VStack spacing={20}>
            <Spacer />
            <SimpleGrid columns={[1, 3]} spacingX={30}>
                <Button
                    bgColor="yellow.400"
                    _hover={{ bgColor: "yellow.500" }}
                    onClick={() => {
                        router.push("/kra/1st_news");
                    }}
                >
                    競馬新聞-1日目
                </Button>
                <Button
                    bgColor="yellow.400"
                    _hover={{ bgColor: "yellow.500" }}
                    onClick={() => {}}
                >
                    競馬新聞-2日目
                </Button>
                <Button
                    bgColor="yellow.400"
                    _hover={{ bgColor: "yellow.500" }}
                    onClick={() => {}}
                >
                    競馬-カタログ
                </Button>
            </SimpleGrid>
        </VStack>
    );
};

export default Page;
