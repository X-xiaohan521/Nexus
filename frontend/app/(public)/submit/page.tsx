import { Metadata } from "next";
import Submit from "./submit";
import ProtectedPage from "@/components/protected-page";

export const metadata: Metadata = {
    title: "Submit"
}

export default function SubmitPage() {
    return (
        <ProtectedPage needAdmin={false}>
            <Submit />
        </ProtectedPage>
    )
}