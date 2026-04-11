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
    isLeaderboardEnabled: boolean,   // 排行榜是否开启
    allowRegistration: boolean,   // 是否允许新用户注册
    defaultAllowSubmit: 0 | 1   // 是否默认允许新用户提交
}

export type GtChoice = string[]

export const defaultSettings: Settings = {
    leaderboardRefreshRate: 3600,
    groundTruth: "./ground_truth/A_test",
    isLeaderboardEnabled: true,
    allowRegistration: false,
    defaultAllowSubmit: 0
}

export const defaultGtChoice: GtChoice = [
    "./ground_truth/A_test",
    "./ground_truth/B_test"
]

export default function () {
    const settings = defaultSettings;
    const gtChoice = defaultGtChoice;
    return (
        <div className="w-full grid grid-cols-2 p-2 space-x-4">
            <div className="">
                <form>
                    <FieldGroup className="gap-4">
                        <FieldSet>
                            <FieldLegend><h1 className="text-xl font-bold">系统设置</h1></FieldLegend>
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
                                            <InputGroupInput id="leaderboard-refresh-rate" defaultValue={settings.leaderboardRefreshRate} />
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
                            <Select defaultValue={settings.groundTruth}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Ground Truth</SelectLabel>
                                        {gtChoice.map((item) => (
                                            <SelectItem value={item}>{item}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FieldSet>
                        <FieldSeparator />
                    </FieldGroup>
                </form>
            </div>
            <div>
                <FieldSet>
                    <FieldLegend>用户设置</FieldLegend>
                    <FieldDescription>
                        设置用户账号权限。
                    </FieldDescription>
                    <FieldGroup>
                        <FieldLabel>
                            <Field orientation="horizontal">
                                <Checkbox id="toggle-register" name="toggle-register" defaultChecked={settings.allowRegistration} />
                                <FieldContent>
                                    <FieldTitle>启用用户注册</FieldTitle>
                                    <FieldDescription>
                                        当该选项关闭时，新用户将无法注册。
                                    </FieldDescription>
                                </FieldContent>
                            </Field>
                        </FieldLabel>
                        <FieldLabel>
                            <Field orientation="vertical">
                                <FieldTitle>新用户默认权限</FieldTitle>
                                <Select defaultValue={settings.defaultAllowSubmit? "allow-submit" : "prohibit-submit"}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>默认权限</SelectLabel>
                                            <SelectItem value="allow-submit">允许提交并参与排行榜</SelectItem>
                                            <SelectItem value="prohibit-submit">不允许提交</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldLabel>

                    </FieldGroup>
                    <FieldSeparator />
                    <Field orientation="horizontal" className="flex flex-col items-end">
                        <div className="space-x-2">
                            <Button>保存设置</Button>
                            <Button variant="outline" type="button">
                                取消
                            </Button>
                        </div>
                    </Field>
                </FieldSet>
            </div>
        </div>
    )
}
