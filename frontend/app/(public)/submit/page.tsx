import { Metadata } from "next";
import { FileUploadCard } from "./file-upload-card";
import { DataTable } from "./data-table";
import { columns, submissions } from "./columns";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

import ProtectedPage from "@/components/protected-page"

export const metadata: Metadata = {
    title: "Submit"
}

export default function() {
    return (
        <ProtectedPage>
            <div className="flex flex-col items-center mx-auto lg:w-200 md:w-120 sm:w-64">
                <FileUploadCard className="lg:w-100" />
                <div className="flex items-center lg:w-200 md:w-120 sm:w-64 justify-between px-2 py-8 bottom-0 h-8">
                    <h1 className="flex text-xl font-bold">提交记录</h1>
                    <Button variant="outline" size="default">
                        <RotateCw />
                        刷新
                    </Button>
                </div>
                <div className="container mx-auto">
                    <DataTable columns={columns} data={submissions} />
                </div>
            </div>
        </ProtectedPage>
    )
}