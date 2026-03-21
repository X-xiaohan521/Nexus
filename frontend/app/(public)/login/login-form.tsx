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
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useUser } from "@/context/user-context"
import { apiFetch } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export type TokenData = {
  token: string
}

export function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameMessage, setUsernameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [logging, setLogging] = useState(false);

  const router = useRouter()

  const { refreshUser } = useUser()

  const validateUsername = (): boolean => {
    setUsernameMessage("");
    if (!username) {
      setUsernameMessage("请输入用户名。");
      return false;
    } else if (username.length < 3) {
      setUsernameMessage("用户名太短，需至少 3 个字符。");
      return false;
    } else if (username.length > 20) {
      setUsernameMessage("用户名太长，至多 20 个字符。");
      return false;
    } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9@._-]+$/.test(username)) {
      setUsernameMessage("用户名中包含不合法字符。");
      return false;
    } else {
      return true;
    }
  }

  const validatePassword = (): boolean => {
    setPasswordMessage("");
    if (!password) {
      setPasswordMessage("请输入密码。");
      return false;
    } else if (password.length < 6) {
      setPasswordMessage("密码太短，需至少 6 个字符。");
      return false;
    } else if (password.length > 20) {
      setPasswordMessage("密码太长，至多 20 个字符。");
      return false;
    } else if (!/^[a-zA-Z0-9@._-]+$/.test(password)) {
      setPasswordMessage("密码中包含不合法字符。");
      return false;
    } else {
      return true;
    }
  }

  const submitLogin = async () => {
    setLogging(true);

    if (!(validateUsername() && validatePassword())) {
      setLogging(false);
      return;
    }

    const response = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password
      })
    })

    const data = response.data as TokenData

    if (response.code === 1) {
      localStorage.setItem("token", data.token)  // store token in localStorage
      router.push("/")
      await refreshUser()
    } else {
      toast.error(response.msg, { position: "top-center" });
    }
    setLogging(false);
  }

  return (
    <form className="w-full max-w-sm"
    onSubmit={(e) => {
      e.preventDefault()
      submitLogin()
    }}>
      <Card>
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
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Field data-invalid={usernameMessage !== ""}>
                <FieldLabel htmlFor="username">用户名</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  required
                  aria-invalid={usernameMessage !== ""}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => validateUsername()}
                />
                <FieldError>{usernameMessage}</FieldError>
              </Field>
            </div>
            <div className="grid gap-2">
              <Field data-invalid={passwordMessage !== ""}>
                <FieldLabel htmlFor="password">密码</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  required
                  aria-invalid={passwordMessage !== ""}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => validatePassword()}
                />
                <FieldError>{passwordMessage}</FieldError>
              </Field>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" disabled={logging}>
            <Spinner data-icon="inline-start" className={logging ? "" : "hidden"} />
            登录
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
