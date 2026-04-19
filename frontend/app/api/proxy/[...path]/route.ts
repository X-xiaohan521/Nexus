import { UniResponse } from "@/lib/api";
import { NextRequest } from "next/server";

const backendBase: string = `http://${
  process.env.NEXUS_BACKEND_HOST ?? "localhost"
}:${
  process.env.NEXUS_BACKEND_PORT ?? "6780"
}`;

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }>}) {
    return handleProxy(req, params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }>}) {
    return handleProxy(req, params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }>}) {
    return handleProxy(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }>}) {
    return handleProxy(req, params);
}

export async function OPTIONS(req: NextRequest, { params }: { params: Promise<{ path: string[] }>}) {
    return handleProxy(req, params);
}

async function handleProxy(req: NextRequest, params: Promise<{ path: string[] }>): Promise<Response> {
    console.log("Get request: ", req)

    // extract uri from proxy request
    const { path } = await params;
    const uri = path.join("/")

    let requestParam = "";
    if (req.url.includes("?")) {
        requestParam = req.url.split("?")[1];
    }

    const targetUrl = `${backendBase}/${uri}${requestParam ? "?" + requestParam : ""}`;

    console.log("Fetching targetUrl: ", targetUrl)

    // fetch from server to backend
    const backendResponse = await fetch(targetUrl,
        {
            method: req.method,
            headers: req.headers,
            body: req.body,
            // @ts-expect-error
            duplex: "half"
        })
    return backendResponse
}
