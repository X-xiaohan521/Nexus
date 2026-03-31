"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/context/user-context";

export default function ProtectedPage({ children, needAdmin }: { children: ReactNode, needAdmin: boolean }) {
    const router = useRouter();
    const { user, refreshUser } = useUser()

    useEffect(() => {
        if (!user) {
            toast.error("你还未登录，请先登录。", { position: "top-center" });
            router.push("/login");
        } else if (needAdmin) {
            if (user.role !== 1) {
                toast.error("你没有权限访问该页面。", { position: "top-center" });
                router.push("/");
            }
        }
    }, [user]);

    if (!user) return null;
    if (needAdmin && user.role !== 1) return null;

    return children;
}
