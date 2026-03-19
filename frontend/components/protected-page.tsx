"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/context/user-context";

export default function ProtectedPage({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { user, refreshUser } = useUser()

    useEffect(() => {
        if (!user) {
            toast.error("你还未登录，请先登录。", { position: "top-center" });
            router.push("/login");
        }
    }, [user]);

    if (!user) return null;

    return children;
}
