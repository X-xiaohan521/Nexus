import { Metadata } from "next";
import { RegisterCard } from "./register-form";

export const metadata: Metadata = {
    title: "Register"
}

export default function() {
    return (
        <>
            <RegisterCard />
        </>
    )
}