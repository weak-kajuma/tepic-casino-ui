import type { AppProps } from "next/app";
import { Box, ChakraProvider, Container } from "@chakra-ui/react";
import { Header } from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <Header />
            <Box w="full" h="full" minH="100vh" bgColor="gray.100">
                <Component {...pageProps} />
            </Box>
        </ChakraProvider>
    );
}

export default MyApp;