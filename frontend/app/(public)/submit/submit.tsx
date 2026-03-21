"use client"

import { FileUploadCard } from "./file-upload-card";
import { DataTable } from "./data-table";
import { columns, SubmissionCell } from "./columns";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export type SubmissionData = {
    submissions: SubmissionCell[]
}

export const defaultSubmissionData: SubmissionData = {
    submissions: []
}

export default function Submit() {
    const [data, setData] = useState<SubmissionData>(defaultSubmissionData)
    const [loading, setLoading] = useState(true)

    async function getData() {
        setLoading(true)
        const response = await apiFetch("/api/submission", {method: "GET"})
        if (response.code === 1) {
            setData({
                submissions: response.data as SubmissionCell[]
            })
        } else {
            toast.error(response.msg, {position: "top-center"})
            setData(defaultSubmissionData)
        }
        setLoading(false)
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="flex flex-col items-center mx-auto lg:w-200 md:w-120 sm:w-64">
            <FileUploadCard />
            <div className="flex items-center lg:w-200 md:w-120 sm:w-64 justify-between px-2 py-8 bottom-0 h-8">
                <h1 className="flex text-xl font-bold">提交记录</h1>
                <Button variant="outline" size="default" onClick={getData} disabled={loading}>
                    <RotateCw className={loading ? "hidden" : ""} />
                    <Spinner data-icon="inline-start" className={loading ? "" : "hidden"} />
                    刷新
                </Button>
            </div>
            <div className="container mx-auto">
                <DataTable columns={columns} data={data.submissions} />
            </div>
        </div>
    )
}