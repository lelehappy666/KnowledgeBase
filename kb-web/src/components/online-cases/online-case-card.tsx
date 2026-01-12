"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OnlineCase {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  platform: string;
  sourceUrl: string;
  createdAt: string;
}

export function OnlineCaseCard({ data }: { data: OnlineCase }) {
  const handleDelete = async (e: React.MouseEvent) => {
    // Prevent the link click from firing
    e.preventDefault();
    // Stop bubbling so parent handlers don't catch it
    e.stopPropagation();
    
    // Direct delete without confirmation
    try {
      const res = await fetch(`/api/online-cases/${data.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("删除成功");
        window.location.reload();
      } else {
        toast.error("删除失败");
      }
    } catch (error) {
      console.error(error);
      toast.error("删除出错");
    }
  };

  return (
    <Link href={`/online-cases/${data.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group relative">
        <div className="aspect-video relative bg-muted overflow-hidden">
          {data.coverImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={data.coverImage}
              alt={data.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              无封面
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white border-none">
            {data.platform}
          </Badge>
          
          <div 
             className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
             }}
          >
             <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={handleDelete}
                title="删除案例"
             >
                <Trash2 className="h-4 w-4" />
             </Button>
          </div>
        </div>
        <CardHeader className="p-4 pb-2">
          <h3 className="font-semibold leading-none tracking-tight line-clamp-1">
            {data.title}
          </h3>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {data.description || "暂无描述"}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex items-center gap-2">
          <CalendarDays className="h-3 w-3" />
          {formatDistanceToNow(new Date(data.createdAt), {
            addSuffix: true,
            locale: zhCN,
          })}
        </CardFooter>
      </Card>
    </Link>
  );
}
