'use client'

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteTrendAction } from "@/app/actions/trend";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteTrendButtonProps {
  id: string;
  name: string;
}

export function DeleteTrendButton({ id, name }: DeleteTrendButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteTrendAction(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("趋势已删除");
        router.push("/cognitive/trends");
      }
    } catch (error) {
      toast.error("删除失败");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
          删除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除?</AlertDialogTitle>
          <AlertDialogDescription>
            您即将删除趋势 "{name}"。此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => {
              e.preventDefault();
              handleDelete();
          }} className="bg-red-600 hover:bg-red-700">
            {isDeleting ? "删除中..." : "确认删除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
