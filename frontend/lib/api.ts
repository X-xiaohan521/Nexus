import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";

const PROXY_URL = "/api/proxy";

export type UniResponse = {
  "code": number,
  "msg": string,
  "data": object
}

export async function apiFetch(url: string, options: RequestInit = {}, isPublicEndpoint: boolean = false): Promise<UniResponse> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token && !isPublicEndpoint) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${PROXY_URL}${url}`, {
      ...options,
      headers,
    });
    console.log("Get response: ", response)
    if (response.status === 401) {
      console.log("Token outdated, removing.")
      localStorage.removeItem("token");
      window.location.href = "/login";
      return {
        "code": 0,
        "msg": "令牌已失效，请重新登录。",
        "data": {}
      }
    }
    if (response.status === 403) {
      console.log("No permission, redirect to home.")
      window.location.href = "/";
      return {
        "code": 0,
        "msg": "你没有权限访问该页面。",
        "data": {}
      }
    }
    return response.json();
  } catch {
    console.log("API fetch failed, check your network.")
    return {
      "code": 0,
      "msg": "请求失败，请检查网络。",
      "data": {}
    }
  }
}

export function getUrl(uri: string) {
    return PROXY_URL + uri
}