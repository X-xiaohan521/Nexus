import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export type Settings = {
    leaderboardRefreshRate: number,   // 单位：s（秒）
    groundTruth: string,   // ground_truth 路径
    isLeaderboardEnabled: boolean   // 排行榜是否开启
}

export type gtChoice = [string]

export const defaultSettings = {
    leaderboardRefreshRate: 3600,
    groundTruth: "./ground_truth/A_test",
    isLeaderboardEnabled: true
}

export const defaultGtChoice = [
    "./ground_truth/A_test",
    "./ground_truth/B_test"
]

export default function () {
    const settings = defaultSettings
    return (
        <div className="flex justify-center">
            <div className="w-120">
                <form>
                    <FieldGroup className="gap-4">
                        <FieldSet>
                            <FieldLegend>系统设置</FieldLegend>
                            <FieldDescription>
                                所有系统设置将在保存后立即生效。
                            </FieldDescription>
                        </FieldSet>
                        <FieldSeparator />
                        <FieldSet>
                            <FieldLegend>排行榜设置</FieldLegend>
                            <FieldDescription>
                                设置用户提交与排行榜更新。
                            </FieldDescription>
                            <FieldGroup>
                                <FieldLabel>
                                    <Field orientation="horizontal">
                                        <Checkbox id="toggle-leaderboard" name="toggle-leaderboard" defaultChecked={settings.isLeaderboardEnabled} />
                                        <FieldContent>
                                            <FieldTitle>启用排行榜</FieldTitle>
                                            <FieldDescription>
                                                当该选项关闭时，用户将无法提交，排行榜将停止刷新。
                                            </FieldDescription>
                                        </FieldContent>
                                    </Field>
                                </FieldLabel>
                                <FieldLabel htmlFor="leaderboard-refresh-rate">
                                    <Field>
                                        <FieldTitle>排行榜刷新率</FieldTitle>
                                        <InputGroup className="h-8">
                                            <InputGroupInput placeholder={String(settings.leaderboardRefreshRate)} id="leaderboard-refresh-rate" defaultValue={settings.leaderboardRefreshRate} />
                                            <InputGroupAddon align="inline-end">秒</InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                </FieldLabel>
                            </FieldGroup>
                        </FieldSet>
                        <FieldSeparator />
                        <FieldSet>
                            <FieldLegend>Ground Truth 设置</FieldLegend>
                            <FieldDescription>
                                设置用于评分的标准答案。
                            </FieldDescription>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={settings.groundTruth} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Ground Truth</SelectLabel>
                                        {defaultGtChoice.map((item) => (
                                            <SelectItem value={item}>{item}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FieldSet>
                        <FieldSeparator />
                        <Field orientation="horizontal" className="flex flex-col items-end">
                            <div className="space-x-2">
                                <Button>保存设置</Button>
                                <Button variant="outline" type="button">
                                    取消
                                </Button>
                            </div>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}
