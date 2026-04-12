"use client"

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
import { apiFetch } from "@/lib/api"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

export type Settings = {
    leaderboardRefreshRate: number,   // 单位：s（秒）
    groundTruth: string,   // ground_truth 路径
    isLeaderboardEnabled: boolean,   // 排行榜是否开启
    allowRegistration: boolean,   // 是否允许新用户注册
    defaultAllowSubmit: 0 | 1   // 是否默认允许新用户提交
    availableGroundTruths: string[]   // 可选的 ground_truth 路径
}

export const defaultSettings: Settings = {
    leaderboardRefreshRate: 3600,
    groundTruth: "./ground_truth/A_test",
    isLeaderboardEnabled: true,
    allowRegistration: false,
    defaultAllowSubmit: 0,
    availableGroundTruths: ["./ground_truth/A_test", "./ground_truth/B_test"]
}

export default function () {
    const [settings, setSettings] = useState<Settings | null>(null)

    const [leaderboardRefreshRate, setLeaderboardRefreshRate] = useState<number>();
    const [groundTruth, setGroundTruth] = useState<string>();
    const [isLeaderboardEnabled, setLeaderboardEnabled] = useState<boolean>();
    const [allowRegistration, setAllowRegistration] = useState<boolean>();
    const [defaultAllowSubmit, setDefaultAllowSubmit] = useState<0 | 1>();

    const [saving, setSaving] = useState(false);

    async function fetchSettings() {
        const response = await apiFetch("/api/admin/config", { method: "GET" }, false);
        if (response.code === 1) {
            setSettings(response.data as Settings);
        } else {
            toast.error(response.msg, { position: "top-center" });
            setSettings(defaultSettings);
        }
    }

    useEffect(() => { fetchSettings() }, [])

    function validateLeaderboardRefreshRate() {

    }

    async function onSaveSettings() {
        setSaving(true);
        console.log(JSON.stringify({
            leaderboardRefreshRate: leaderboardRefreshRate,
            groundTruth: groundTruth,
            isLeaderboardEnabled: isLeaderboardEnabled,
            allowRegistration: allowRegistration,
            defaultAllowSubmit: defaultAllowSubmit,
        }))
        const response = await apiFetch("/api/admin/config", {
            method: "POST", body: JSON.stringify({
                leaderboardRefreshRate: leaderboardRefreshRate,
                groundTruth: groundTruth,
                isLeaderboardEnabled: isLeaderboardEnabled,
                allowRegistration: allowRegistration,
                defaultAllowSubmit: defaultAllowSubmit,
            })
        })
        setSaving(false);
    }

    if (!settings) {
        return <SkeletonSettings />;
    }

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                onSaveSettings();
            }}
        >
            <div className="w-full grid grid-cols-2 p-2 space-x-4">
                <div className="">
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
                                        <Checkbox id="toggle-leaderboard" name="toggle-leaderboard"
                                            defaultChecked={settings.isLeaderboardEnabled}
                                            checked={isLeaderboardEnabled}
                                            onCheckedChange={(checked) => setLeaderboardEnabled(checked === true)}
                                        />
                                        <FieldContent>
                                            <FieldTitle>启用排行榜</FieldTitle>
                                            <FieldDescription>
                                                当该选项关闭时，用户将无法提交。
                                            </FieldDescription>
                                        </FieldContent>
                                    </Field>
                                </FieldLabel>
                                <FieldLabel htmlFor="leaderboard-refresh-rate">
                                    <Field>
                                        <FieldTitle>排行榜刷新率</FieldTitle>
                                        <InputGroup className="h-8">
                                            <InputGroupInput id="leaderboard-refresh-rate"
                                                defaultValue={settings.leaderboardRefreshRate}
                                                onChange={e => setLeaderboardRefreshRate(Number(e.target.value))}
                                                onBlur={validateLeaderboardRefreshRate}
                                            />
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
                            <Select defaultValue={settings.groundTruth} onValueChange={setGroundTruth}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Ground Truth</SelectLabel>
                                        {settings.availableGroundTruths.map((item) => (
                                            <SelectItem value={item}>{item}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FieldSet>
                        <FieldSeparator />
                    </FieldGroup>

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
                                    <Checkbox id="toggle-register" name="toggle-register"
                                        defaultChecked={settings.allowRegistration}
                                        checked={allowRegistration}
                                        onCheckedChange={(checked) => { setAllowRegistration(checked === true) }}
                                    />
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
                                    <Select defaultValue={settings.defaultAllowSubmit ? "allow-submit" : "prohibit-submit"} onValueChange={(e) => {
                                        setDefaultAllowSubmit((e === "allow-submit") ? 1 : 0)
                                    }}>
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
                                <Button type="submit" disabled={saving}>
                                    <Spinner data-icon="inline-start" className={saving ? "" : "hidden"} />
                                    保存设置
                                </Button>
                                <Button variant="outline" type="button">
                                    取消
                                </Button>
                            </div>
                        </Field>
                    </FieldSet>
                </div>
            </div>
        </form>
    )
}

export function SkeletonSettings() {
    return (
        <div className="w-full grid grid-cols-2 p-2 space-x-4">
            <div className="flex w-full max-w-xs flex-col gap-7">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex w-full max-w-xs flex-col gap-7">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <Skeleton className="h-8 w-24" />
            </div>
        </div>
    )
}
