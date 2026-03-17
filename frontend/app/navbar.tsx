"use client"

import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { getUrl } from '@/lib/api'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/leaderboard">排行榜</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/submit">提交</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export function TopBar() {
  const router = useRouter()

  const onClickAvatar = () => {
    if (!localStorage.getItem("token")) {
      router.push("/login")
    } else {
      router.push("/account/profile")
    }
  }

  return (
    <div className="h-14 ">
      <div className="container mx-auto lg:w-250 md:w-150 sm:w-80 flex h-full items-center justify-between">
        {/* Left section: Logo + Nav */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link href={"/"}><div className="text-xl font-bold">AiLab</div></Link>
        </div>

        {/* Right section: Navbar + ThemeToggle + Sign In / username */}
        <div className="flex items-center space-x-4">
          <Navbar />
          <ThemeToggle />
          <Link href={"/login"}>
            <Button size="default" variant="default" className="cursor-pointer transition-colors">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}