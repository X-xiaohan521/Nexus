"use client"

import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { CloudUpload, FileChartColumn } from "lucide-react"
import { useRef, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"

export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  const formatted = parseFloat(size.toFixed(decimals));
  return `${formatted} ${units[i]}`;
}

export function FileUploadCard() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    function isFileValid(file: File): boolean {
        if (file.type !== "text/csv") {
            toast.error("仅允许提交 .csv 文件！", {position: "top-center"})
            return false
        } else if (file.size > 10485760) {
            toast.error("最大文件大小不得超过 10MB。", {position: "top-center"})
            return false
        } else if (file.name.length > 50) {
            toast.error("文件名长度不得超过 50 个字符。", {position: "top-center"})
            return false
        } else if (!/^[ \u4e00-\u9fa5a-zA-Z._-]+$/.test(file.name)) {
            toast.error("文件名只允许包含：中文/英文字符、小数点、下划线、横线。", {position: "top-center"})
            return false
        } else {
            return true
        }
    }

    function clearFile() {
        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSelect = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(null)
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            console.log("Selected file: ", selectedFile)
            if (isFileValid(selectedFile)) {
                setFile(selectedFile)
            } else {
                clearFile()
            }
        }
    }

    const handleCancel = () => {
        clearFile()
        toast.info("已取消提交。", {position: "top-center"})
    }

    const handleUpload = async () => {
        setLoading(true)
        if (!file) {
            setLoading(false)
            toast.error("请先选择文件。", {position: "top-center"})
            return
        } else if (!isFileValid(file)) {
            setLoading(false)
            clearFile()
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await apiFetch("/api/submission", {
            method: "POST",
            body: formData
        })

        if (response.code === 1) {
            toast.success("提交成功~", {position: "top-center"})
            clearFile()
        } else {
            toast.error(response.msg, {position: "top-center"})
        }
        setLoading(false)
    }

    if (file) {
        return (
            <div className="lg:w-100">
                <Card size="sm" className="mx-auto w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>确认提交？</CardTitle>
                        <CardDescription>
                            即将提交以下文件，请确认
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Item variant="outline">
                            <ItemMedia variant="icon">
                                <FileChartColumn />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle>{file.name}</ItemTitle>
                                <ItemDescription>{formatFileSize(file.size)}</ItemDescription>
                            </ItemContent>
                        </Item>
                    </CardContent>
                    <CardFooter className="flex justify-center space-x-4">
                        <Button variant="default" className="w-[45%]" onClick={handleUpload} disabled={loading}>
                            <Spinner data-icon="inline-start" className={loading ? "" : "hidden"} />
                            提交
                        </Button>
                        <Button variant="outline" className="w-[45%]" onClick={handleCancel} disabled={loading}>
                            取消
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="lg:w-100">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".csv"
            />
            <Empty className="border border-dashed">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <CloudUpload />
                    </EmptyMedia>
                    <EmptyTitle>提交结果</EmptyTitle>
                    <EmptyDescription>
                        在这里提交你的模型推理结果，将由系统自动判分。
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button variant="outline" size="sm" onClick={handleSelect}>
                        选择文件
                    </Button>
                </EmptyContent>
            </Empty>
        </div>
    )
}
