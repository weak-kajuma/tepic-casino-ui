import FirebaseApp from '../../utils/FirebaseApp'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import Link from 'next/link'
import { useState } from 'react'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Router from 'next/router'
import {
    Stack,
    VStack,
    FormControl,
    Heading,
    Input,
    InputGroup,
    InputRightAddon,
    InputRightElement,
    Button,
    useToast
} from '@chakra-ui/react'

const Home = () => {
    const auth = getAuth(FirebaseApp)
    const [isShow, setIsShow] = useState(false)
    const [email, setEmail] = useState("@tak.ed.jp")
    const [password, setPassword] = useState("")
    const toast = useToast()

    const handlePasswordShow = () => setIsShow(!isShow)

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                auth.currentUser?.getIdToken()
                    .then(idtoken => {
                        setCookie(null, 'idToken', idtoken, {maxAge: 60 * 60, path: '/'})
                        toast({
                            title: "Login successful.",
                            description: "We've logined.",
                            status: "success",
                            duration: 5000,
                            isClosable: true
                        })
                        Router.push("/admin/")
                    })
            })
            .catch((error) => {
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        toast({title: "Login failed.", description: "You're missing Email or Password.", 
                            status: "error", duration: 5000, isClosable: true})
                        break
                    default:
                        toast({title: "Login failed.", description: "Something worng", 
                            status: "error", duration: 5000, isClosable: true})
                }
            })
    }
    return (
    <VStack padding="20px">
        <VStack width="80vw">
            {!parseCookies().idToken ? (
                <>
                    <Heading>Login</Heading>
                    <FormControl>
                        <Stack spacing={4}>
                            <InputGroup>
                                <Input id="email" type='email' onChange={e => setEmail(e.target.value + "@tak.ed.jp")}/>
                                <InputRightAddon children='@tak.ed.jp' />
                            </InputGroup>
                            <InputGroup>
                                <Input id="password" pr='4.5rem' placeholder='Enter password' type={isShow?"text":"password"} onChange={e => setPassword(e.target.value)}/>
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handlePasswordShow}>
                                        {isShow?"Hide":"Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <InputGroup>
                                <Button marginLeft="auto" marginRight="10px" backgroundColor={"white"} onClick={handleLogin}>Login</Button>
                            </InputGroup>
                        </Stack>
                    </FormControl>
                    <Stack>
                        <Link href="/admin/"><Button mt="20px" bgColor="blue.200">Go Back</Button></Link>
                    </Stack>
                </>
            ): (
                <>
                    <p>You're Logined now.</p>
                    <Link href="/admin/"><Button mt="20px" bgColor="blue.200">Go Back</Button></Link>
                </>
            )}
            
        </VStack>
    </VStack>
    )
}

export default Home