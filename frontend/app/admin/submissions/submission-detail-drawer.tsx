"use client"

import { Button } from "@/components/ui/button";
import { DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, Drawer } from "@/components/ui/drawer";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export type SubmissionDetail = {
    id: number
    username: string,
    status: 0 | 1 | 2 | 3
    score: number | null
    submissionTime: string
    errMsg: string | null
    fileUri: string
}

const defaultSubmissionDetail: SubmissionDetail = {
    id: 3,
    username: "unimilk",
    fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv",
    status: 1,
    score: 0.53592587,
    errMsg: null,
    submissionTime: "2026-04-07 21:31:43",
}

export function SubmissionDetailDrawer({ open, onOpenChange, id }: { open: boolean, onOpenChange: (open: boolean) => void, id: number | undefined }) {
    
    const [detail, setDetail] = useState<SubmissionDetail>()

    async function getDetail() {
        const response = await apiFetch(`/api/admin/submission/${id}`);
        if (response.code === 1) {
            setDetail(response.data as SubmissionDetail);
        } else {
            toast.error(response.msg, {position: "top-center"});
            setDetail(defaultSubmissionDetail);
        }
    }

    useEffect(() => { getDetail() }, [open, id]);

    if (!detail) {
        return;
    }

    return (
        <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>提交详情</DrawerTitle>
                    <DrawerDescription>Details for submission #{detail.id}</DrawerDescription>
                </DrawerHeader>
                <div className="no-scrollbar overflow-y-auto px-4 space-y-4">
                    <div>
                        <h1 className="font-bold pb-2">提交 ID</h1>
                        <p className="pl-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed">{detail.id}</p>
                    </div>
                    <div>
                        <h1 className="font-bold pb-2">用户名</h1>
                        <p className="pl-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed">{detail.username}</p>
                    </div>
                    <div>
                        <div className="flex space-x-2 items-end pb-2">
                            <h1 className="font-bold">文件存储路径</h1>
                            <Copy className="size-4 cursor-pointer" onClick={(e) => {
                                navigator.clipboard.writeText(detail.fileUri)
                                toast.info("已复制到剪贴板。", { position: "top-center" })
                            }} />
                        </div>
                        <p className="pl-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed">{detail.fileUri}</p>
                    </div>
                    <div>
                        <h1 className="font-bold pb-2">状态</h1>
                        <p className="pl-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed">{detail.status}</p>
                    </div>
                    <div>
                        <h1 className="font-bold pb-2">分数</h1>
                        <p className="pl-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed">{detail.score ? detail.score : "无"}</p>
                    </div>
                    <div>
                        <h1 className="font-bold pb-2">错误信息</h1>
                        <p className="pl-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed">{detail.errMsg ? detail.errMsg : "无"}</p>
                    </div>
                    <div>
                        <h1 className="font-bold pb-2">提交时间</h1>
                        <p className="pl-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed">{detail.submissionTime}</p>
                    </div>
                </div>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button>关闭</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
