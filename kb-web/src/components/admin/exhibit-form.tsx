'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createExhibitAction, updateExhibitAction } from '@/app/actions/exhibit'
import { uploadFileAction } from '@/app/actions/upload'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Upload, X, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ExhibitFormProps {
    initialData?: any
    isEditing?: boolean
}

// 定义 Asset 类型
interface Asset {
    id: string;
    name: string;
    type: string;
    path: string;
    mimeType: string | null;
}

export function ExhibitForm({ initialData, isEditing = false }: ExhibitFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [assets, setAssets] = useState<Asset[]>(initialData?.assets || [])
    
    // 素材库选择状态
    const [isAssetLibraryOpen, setIsAssetLibraryOpen] = useState(false)
    const [libraryAssets, setLibraryAssets] = useState<Asset[]>([])
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false)

    // Metadata State
    const [metadata, setMetadata] = useState(initialData?.metadata ? JSON.parse(initialData.metadata) : {
        trends: {},
        evaluation: { score: 0 },
        principles: {},
        engineering: {},
        cost: {}
    })

    // 加载素材库
    const loadAssetLibrary = async () => {
        setIsLoadingLibrary(true)
        try {
            // 这里我们暂时直接复用 getRecentAssets 的逻辑，实际项目中应该有一个专门的 API
            // 由于是 Server Action 限制，我们这里做一个简单的 fetch
            const res = await fetch('/api/assets/recent') // 我们需要创建这个 API
            if (res.ok) {
                const data = await res.json()
                setLibraryAssets(data)
            }
        } catch (error) {
            console.error("Failed to load assets", error)
            toast.error("加载素材库失败")
        } finally {
            setIsLoadingLibrary(false)
        }
    }

    // 当打开素材库弹窗时加载数据
    useEffect(() => {
        if (isAssetLibraryOpen) {
            loadAssetLibrary()
        }
    }, [isAssetLibraryOpen])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        const result = await uploadFileAction(formData)
        if (result.success) {
            setAssets([...assets, result.asset])
            toast.success('文件上传成功')
        } else {
            toast.error('文件上传失败')
        }
    }
    
    const handleSelectAsset = (asset: Asset) => {
        // 避免重复添加
        if (!assets.find(a => a.id === asset.id)) {
            setAssets([...assets, asset])
            toast.success(`已添加: ${asset.name}`)
        } else {
            toast.info("该素材已添加")
        }
        setIsAssetLibraryOpen(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        formData.append('metadata', JSON.stringify(metadata))
        formData.append('assetIds', JSON.stringify(assets.map(a => a.id)))

        try {
            if (isEditing && initialData?.id) {
                const res = await updateExhibitAction(initialData.id, formData)
                if (res.success) {
                    toast.success('更新成功')
                    router.refresh()
                    router.push('/admin') // 更新成功后跳转回列表，避免停留在编辑页产生困惑
                } else {
                    toast.error('更新失败: ' + (res.error || '未知错误'))
                }
            } else {
                const res = await createExhibitAction(formData)
                if (res.success) {
                    toast.success('创建成功')
                    router.push('/admin')
                } else {
                    toast.error('创建失败: ' + (res.error || '未知错误'))
                }
            }
        } catch (error) {
            console.error(error)
            toast.error('操作异常')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>取消</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? '保存修改' : '创建展品'}
                </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>基本信息</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">展品名称</Label>
                                <Input id="title" name="title" defaultValue={initialData?.title} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">简短描述</Label>
                                <Textarea id="description" name="description" defaultValue={initialData?.description} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">详细介绍 (Markdown)</Label>
                                <Textarea id="content" name="content" className="min-h-[200px]" defaultValue={initialData?.content} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>多媒体资源</CardTitle>
                            <Dialog open={isAssetLibraryOpen} onOpenChange={setIsAssetLibraryOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">从素材库选择</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>选择素材</DialogTitle>
                                    </DialogHeader>
                                    <ScrollArea className="h-[400px] w-full p-4 border rounded-md">
                                        {isLoadingLibrary ? (
                                            <div className="flex items-center justify-center h-full">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-4">
                                                {libraryAssets.map((asset) => (
                                                    <div 
                                                        key={asset.id} 
                                                        className="relative group border rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary aspect-square"
                                                        onClick={() => handleSelectAsset(asset)}
                                                    >
                                                        {asset.type === 'IMAGE' ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={`/api/file/${asset.id}`} alt={asset.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-muted text-xs p-2 text-center break-all">
                                                                {asset.name}
                                                            </div>
                                                        )}
                                                        {assets.find(a => a.id === asset.id) && (
                                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                                <Check className="h-8 w-8 text-primary" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {libraryAssets.length === 0 && (
                                                    <div className="col-span-3 text-center py-8 text-muted-foreground">
                                                        暂无素材，请先上传
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {assets.map((asset) => (
                                    <div key={asset.id} className="relative group border rounded-lg overflow-hidden aspect-square flex items-center justify-center bg-muted">
                                        {asset.type === 'IMAGE' ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={`/api/file/${asset.id}`} alt={asset.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-xs text-center p-2 break-all">{asset.name}</div>
                                        )}
                                        <button 
                                            type="button"
                                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => setAssets(assets.filter(a => a.id !== asset.id))}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors aspect-square">
                                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">上传新文件</span>
                                    <input type="file" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>发布设置</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">状态</Label>
                                <Select name="status" defaultValue={initialData?.status || 'draft'}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择状态" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">草稿</SelectItem>
                                        <SelectItem value="published">已发布</SelectItem>
                                        <SelectItem value="archived">已归档</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>知识维度 (Metadata)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="trends">
                                <TabsList className="grid w-full grid-cols-3 mb-4">
                                    <TabsTrigger value="trends">趋势</TabsTrigger>
                                    <TabsTrigger value="evaluation">评价</TabsTrigger>
                                    <TabsTrigger value="cost">成本</TabsTrigger>
                                </TabsList>
                                <TabsContent value="trends" className="space-y-2">
                                    <Label>技术趋势标签</Label>
                                    <Input 
                                        placeholder="例如: AI视觉, 空间计算" 
                                        value={metadata.trends?.tags || ''}
                                        onChange={e => setMetadata({...metadata, trends: {...metadata.trends, tags: e.target.value}})}
                                    />
                                </TabsContent>
                                <TabsContent value="evaluation" className="space-y-2">
                                    <Label>综合评分 (1-5)</Label>
                                    <Input 
                                        type="number" 
                                        min="1" 
                                        max="5"
                                        value={metadata.evaluation?.score || 0}
                                        onChange={e => setMetadata({...metadata, evaluation: {...metadata.evaluation, score: parseInt(e.target.value)}})}
                                    />
                                </TabsContent>
                                <TabsContent value="cost" className="space-y-2">
                                    <Label>估算成本 (万)</Label>
                                    <Input 
                                        placeholder="例如: 10-30"
                                        value={metadata.cost?.range || ''}
                                        onChange={e => setMetadata({...metadata, cost: {...metadata.cost, range: e.target.value}})}
                                    />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
