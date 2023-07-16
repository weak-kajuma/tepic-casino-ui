import {
    Container,
    Flex,
    Heading,
    Link,
    Spacer,
    chakra,
} from "@chakra-ui/react"
import NextLink from "next/link"

export const Header = () => (
        <chakra.header py="calc(1vh)" bgColor={"blue.200"} position={"sticky"} top={0} zIndex={1}>
            <Container maxW={"container.lg"}>
                <Flex>
                    <Link href={"/"} as={NextLink} _hover={{ opacity: 0.8 }}>
                        <Heading color={"white"}>EPRD-Casino</Heading>
                    </Link>
                    <Spacer aria-hidden />
                </Flex>
            </Container>
        </chakra.header>
)
