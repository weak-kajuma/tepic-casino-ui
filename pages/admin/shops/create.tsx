import { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";

const Page: NextPage = () => {
    return (
        <>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<{ hoge: null }> = async ctx => {
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

export default Page