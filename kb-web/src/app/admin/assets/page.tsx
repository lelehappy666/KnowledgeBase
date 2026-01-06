'use client'

import { useState } from 'react'
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, File, CheckCircle2 } from "lucide-react";
import { uploadFileAction } from "@/app/actions/upload";
import { toast } from "sonner";
import Link from "next/link";

export default function AssetsPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUploads = [];

    for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        
        try {
            const result = await uploadFileAction(formData);
            if (result.success) {
                newUploads.push(result.asset);
            }
        } catch (error) {
            console.error(error);
        }
    }

    setUploadedFiles([...uploadedFiles, ...newUploads]);
    setIsUploading(false);
    toast.success(`成功上传 ${newUploads.length} 个文件`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">素材管理</h1>
                <p className="text-muted-foreground mt-2">批量上传图片、视频或模型文件到资源库。</p>
            </div>
             <Button variant="outline" asChild>
                <Link href="/admin">返回后台</Link>
            </Button>
        </div>

        <div className="grid gap-8">
            <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-muted rounded-full p-4 mb-4">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">点击或拖拽上传文件</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                        支持 JPG, PNG, MP4, GLB, GLTF 等格式。
                        <br />
                        文件将保存到服务器本地存储。
                    </p>
                    <div className="relative">
                        <Button disabled={isUploading}>
                            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            选择文件
                        </Button>
                        <Input 
                            type="file" 
                            multiple 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                    </div>
                </CardContent>
            </Card>

            {uploadedFiles.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>本次上传记录</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                                    <div className="flex items-center gap-3">
                                        <File className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium">{file.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-600 text-xs">
                                        <CheckCircle2 className="h-4 w-4" />
                                        已保存
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
