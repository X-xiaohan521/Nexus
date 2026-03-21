import { Metadata } from "next";
import Submit from "./submit";

export const metadata: Metadata = {
    title: "Submit"
}

export default function SubmitPage() {
    return (
        <>
            <Submit />
        </>
    )
}