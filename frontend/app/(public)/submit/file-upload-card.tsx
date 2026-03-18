import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import { CloudUpload } from "lucide-react"

export function FileUploadCard({className}: React.ComponentProps<"div">) {
  return (
    <div className={className}>
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
            <Button variant="outline" size="sm">
            选择文件
            </Button>
        </EmptyContent>
        </Empty>
    </div>
  )
}
