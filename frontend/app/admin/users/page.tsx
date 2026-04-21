"use client"

import { apiFetch } from "@/lib/api";
import { columns, UserCell } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function() {
    const [data, setData] = useState<UserCell[]>([]);

    const [loading, setLoading] = useState(false);

    async function getData() {
        setLoading(true);

        const response = await apiFetch("/api/admin/users")

        if (response.code === 1) {
            setData(response.data as UserCell[])
        } else {
            toast.error(response.msg, {position: "top-center"});
            setData([]);
        }

        setLoading(false);
    }

    useEffect(() => { getData() }, []);

    return (
        <div className="space-y-2 py-2">
            <div className="flex justify-between">
                <h1 className="font-bold px-2 text-xl">用户管理</h1>
                <Button variant="outline" size="default" onClick={e => {
                    e.preventDefault();
                    getData();
                }}>
                    <RotateCw className={loading ? "hidden" : ""} />
                    <Spinner data-icon="inline-start" className={loading ? "" : "hidden"} />
                    刷新
                </Button>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}