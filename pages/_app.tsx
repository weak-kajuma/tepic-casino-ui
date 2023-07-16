import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
    styles={"@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;200;300;400;500;600;700;800;900&display=swap')"}
  />
)

const theme = extendTheme({
  fonts: {
    heading: `'Noto Sans JP', sans-serif`,
    body: `'Noto Sans JP', sans-serif`,
  },
})

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      {/* <Fonts/> */}
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
