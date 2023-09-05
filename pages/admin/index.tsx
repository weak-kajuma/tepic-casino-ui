import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Heading,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { parseCookies, destroyCookie } from "nookies";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import readQRCode from "../../utils/popupQrcodeReader";

const Page: NextPage = () => {
    const router = useRouter();

    return (
        <VStack>
            <SimpleGrid columns={[1, 3]} spacing="40px" margin="20px">
                <Card width={200}>
                    <CardHeader>
                        <Heading size={"md"}>決済</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>QRコードを読み込んで決済する</Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            bgColor={"yellow.400"}
                            _hover={{ bgColor: "yellow.500" }}
                        >
                            <Link href="/admin/transactions">Click</Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card width={200}>
                    <CardHeader>
                        <Heading size={"md"}>ユーザー</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>
                            QRコードを読み取ってユーザーの情報を確認する
                        </Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            bgColor={"purple.400"}
                            _hover={{ bgColor: "purple.500" }}
                            onClick={async () => {
                                const qrcode = await readQRCode(
                                    "^https://casino.takatsuki.club/users[?]id=[a-z0-9][a-z0-9][a-z0-9][a-z0-9]&token="
                                );
                                router.push(qrcode);
                            }}
                        >
                            Click
                        </Button>
                    </CardFooter>
                </Card>
                <Card width={200}>
                    <CardHeader>
                        <Heading size={"md"}>店舗</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>店舗の追加や削除をする</Text>
                    </CardBody>
                    <CardFooter>
                        <Link href="/admin/shops">
                            <Button
                                bgColor={"cyan.400"}
                                _hover={{ bgColor: "cyan.500" }}
                            >
                                Click
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                <Card width={200}>
                    <CardHeader>
                        <Heading size={"md"}>アカウント</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>ユーザーアカウントの作成や削除をする</Text>
                    </CardBody>
                    <CardFooter>
                        <Link href="/admin/accounts">
                            <Button
                                bgColor={"teal.400"}
                                _hover={{ bgColor: "teal.500" }}
                            >
                                Click
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                <Card width={200}>
                    <CardHeader>
                        <Heading size={"md"}>情報</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>サーバーの負荷状況や運営の損失を確認する</Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            bgColor={"blue.400"}
                            _hover={{ bgColor: "blue.500" }}
                        >
                            Click
                        </Button>
                    </CardFooter>
                </Card>
                <Card width={200}>
                    <CardHeader>
                        <Heading size={"md"}>ログアウト</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>管理アカウントをログアウトする</Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            bgColor={"red.400"}
                            _hover={{ bgColor: "red.500" }}
                            onClick={() => {
                                destroyCookie(null, "idToken");
                                Router.push("/admin/login");
                            }}
                        >
                            Click
                        </Button>
                    </CardFooter>
                </Card>
            </SimpleGrid>
        </VStack>
    );
};

export const getServerSideProps: GetServerSideProps<{ hoge: null }> = async (
    ctx
) => {
    const idToken = parseCookies(ctx).idToken;
    if (!idToken) {
        return {
            redirect: {
                permanent: false,
                destination: "/admin/login",
            },
        };
    }
    return {
        props: {
            hoge: null,
        },
    };
};

export default Page;
