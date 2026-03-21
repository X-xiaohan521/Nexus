"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { TokenData } from "../login/login-form"
import { apiFetch } from "@/lib/api"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

export function RegisterCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameMessage, setUsernameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [registering, setRegistering] = useState(false)

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
    } else if (!/^[a-zA-Z0-9@._-]+$/.test(username)) {
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
    } else if (!/^[a-zA-Z0-9@._-]+$/.test(password)) {
      setPasswordMessage("密码中包含不合法字符。");
      return false;
    } else {
      return true;
    }
  }

  const submitRegister = async () => {
    setRegistering(true);

    if (!(validateUsername() && validatePassword())) {
      setRegistering(false);
      return;
    }

    const response = await apiFetch("/api/auth/register", {
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
    setRegistering(false);
  }

  return (
    <form className="w-full max-w-sm"
      onSubmit={(e) => {
        e.preventDefault()
        submitRegister()
      }}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">注册</CardTitle>
          <CardDescription>
            填写用户名和密码以注册
          </CardDescription>
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
          <Button type="submit" className="w-full" disabled={registering}>
            <Spinner data-icon="inline-start" className={registering ? "" : "hidden"} />
            注册
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
