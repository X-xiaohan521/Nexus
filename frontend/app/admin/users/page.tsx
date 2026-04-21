"use client"

import { apiFetch } from "@/lib/api";
import { columns, UserCell } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function() {
    const [data, setData] = useState<UserCell[]>([]);

    async function getData() {
        const response = await apiFetch("/api/admin/users")

        if (response.code === 1) {
            setData(response.data as UserCell[])
        } else {
            toast.error(response.msg, {position: "top-center"});
            setData([]);
        }
    }

    useEffect(() => { getData() }, []);

    return (
        <div className="space-y-2 py-2">
            <h1 className="font-bold px-2 text-xl">用户管理</h1>
            <DataTable columns={columns} data={data} />
        </div>
    )
}