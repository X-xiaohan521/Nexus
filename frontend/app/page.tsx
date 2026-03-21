import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-2 mx-auto lg:w-200 md:w-120 sm:w-64">
      <h1 className="text-3xl font-bold">欢迎来到 Nexus！</h1>
      <h1 className="text-lg text-muted-foreground">Welcome to Nexus !</h1>
      <Separator />
      <h2 className="">这是一个可以提交你的模型推理结果，并参与到排行榜的平台。</h2>
      <h2 className="text-center text-muted-foreground">An AI ranking system from AiLab, where you can commit your result and gain a place on the leaderboard.</h2>
      <div className="flex pt-1 space-x-2">
        <Link href={"/submit"}><Button size="lg">提交结果</Button></Link>
        <Link href={"/leaderboard"}><Button size="lg" variant="ghost">查看排行榜</Button></Link>
      </div>
    </div>
  );
}
