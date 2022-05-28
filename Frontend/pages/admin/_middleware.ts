import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        authorized: ({ token }) => token?.isAdmin === true,
    },
});
