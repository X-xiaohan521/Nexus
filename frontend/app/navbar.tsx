"use client"

import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

  const {user, refreshUser} = useUser()
  // const user = {
  //   username: "Milk",
  //   role: 0
  // }

  const onLogout = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token")
    }
    refreshUser()
  }

  function getSign() {
    if (!user) {
      return (
        <Link href={"/login"}>
          <Button size="default" variant="default">
            Sign In
          </Button>
        </Link>
      )
    } else {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="default" variant="link">
              {user.username}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onLogout}>
                退出登录
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }

  return (
    <div className="h-14 ">
      <div className="container mx-auto lg:w-250 md:w-150 sm:w-80 flex h-full items-center justify-between">
        {/* Left section: Logo + Nav */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link href={"/"}><div className="text-xl font-bold">Nexus</div></Link>
        </div>

        {/* Right section: Navbar + ThemeToggle + Sign In / username */}
        <div className="flex items-center space-x-4">
          <Navbar />
          <ThemeToggle />
          {getSign()}
        </div>
      </div>
    </div>
  )
}