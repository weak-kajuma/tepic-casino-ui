import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Heading,
    Link,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { parseCookies, destroyCookie } from "nookies";
import Router, { useRouter } from "next/router";

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
                            onClick={() => {
                                window.open("/", "決済", "popup=true");
                            }}
                        >
                            Click
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
                        <Button bgColor={"purple.400"}>Click</Button>
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
                        <Button bgColor={"lightgreen"}>Click</Button>
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
                        <Button
                            bgColor={"lightblue"}
                            onClick={() => router.push("/admin/accounts")}
                        >
                            Click
                        </Button>
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
                        <Button bgColor={"blue.500"}>Click</Button>
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
