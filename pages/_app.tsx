import type { AppProps } from "next/app";
import { Box, ChakraProvider, Container } from "@chakra-ui/react";
import { Header } from "../components/Header";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <Head>
                <title>でんぶつベガス</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@1,700&display=swap');
                </style>
            </Head>
            <Header />
            <Box w="full" h="full" minH="100vh" bgColor="gray.200">
                <Component {...pageProps} />
            </Box>
        </ChakraProvider>
    );
}

export default MyApp;
