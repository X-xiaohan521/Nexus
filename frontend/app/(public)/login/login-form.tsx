"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function LoginCard() {

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">登录</CardTitle>
        <CardDescription>
          输入用户名和密码以登录
        </CardDescription>
        <CardAction>
            <Link href="/register"><Button variant="link">没有账号？注册</Button></Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">密码</Label>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          登录
        </Button>
      </CardFooter>
    </Card>
  )
}
