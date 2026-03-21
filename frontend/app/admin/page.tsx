import ProtectedPage from "@/components/protected-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin"
}

export default function() {
    return (
        <ProtectedPage needAdmin={true}>
            <h1>后台管理页面</h1>
        </ProtectedPage>
    )
}