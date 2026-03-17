import { Metadata } from "next";
import { LoginCard } from "./login-form";

export const metadata: Metadata = {
    title: "Login"
}

export default function() {
    return (
        <>
            <LoginCard />
        </>
    )
}