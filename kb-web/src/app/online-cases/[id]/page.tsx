import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OnlineCaseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const onlineCase = await db.onlineCase.findUnique({
    where: { id },
  });

  if (!onlineCase) {
    notFound();
  }

  // Parse content to get videoUrl and fullDescription if available
  let videoUrl = "";
  let fullDescription = "";
  let projectModulesHtml = "";
  try {
    const contentJson = JSON.parse(onlineCase.content || "{}");
    videoUrl = contentJson.videoUrl || "";
    fullDescription = contentJson.rawDescription || "";
    projectModulesHtml = contentJson.projectModulesHtml || "";
  } catch (e) {
    console.error("Failed to parse content JSON", e);
  }

  // Fallback to DB description if rawDescription is missing
  const displayDescription = fullDescription || onlineCase.description;

  // Debug output
  console.log("Detail Page Render:", {
      id: onlineCase.id,
      title: onlineCase.title,
      descriptionLength: displayDescription?.length,
      videoUrl: videoUrl
  });

  // CUSTOM LAYOUT FOR BEHANCE
  if (onlineCase.platform === 'BEHANCE') {
      return (
        <div className="container mx-auto py-8 max-w-screen-xl">
           {/* Top Navigation Row */}
           <div className="flex items-center justify-between mb-8">
            <Link href="/online-cases">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回列表
              </Button>
            </Link>
            
            <a href={onlineCase.sourceUrl} target="_blank" rel="noopener noreferrer">
              <Button>
                <ExternalLink className="mr-2 h-4 w-4" />
                访问原网页
              </Button>
            </a>
          </div>

           {/* Custom Behance Layout */}
           <div className="max-w-6xl mx-auto">
               <h1 className="text-3xl font-bold tracking-tight lg:text-5xl text-center mb-4">
                   {onlineCase.title}
               </h1>
               
               <div className="flex items-center justify-center gap-2 text-muted-foreground mb-12">
                   <span className="uppercase tracking-wider text-sm font-semibold text-primary">
                       {onlineCase.platform}
                   </span>
                   <span>•</span>
                   <span className="text-sm">
                       {onlineCase.createdAt.toLocaleDateString()}
                   </span>
               </div>
               
               {projectModulesHtml ? (
                   <div 
                       id="behance-modules"
                       // Remove strict width constraints to respect original layout
                       // Only ensure max-width to prevent overflow
                       className="behance-content [&_.project-module]:mb-8"
                       dangerouslySetInnerHTML={{ __html: projectModulesHtml }}
                   />
               ) : (
                   <div className="text-center text-muted-foreground py-20 bg-muted/20 rounded-xl">
                       <p className="mb-4">暂无详细内容预览</p>
                       <p className="text-sm">请点击右上角访问原网页查看</p>
                   </div>
               )}
           </div>
        </div>
      );
  }

  return (
    <div className="container mx-auto py-8 max-w-screen-xl">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/online-cases">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
        </Link>
        
        <a href={onlineCase.sourceUrl} target="_blank" rel="noopener noreferrer">
          <Button>
            <ExternalLink className="mr-2 h-4 w-4" />
            访问原网页
          </Button>
        </a>
      </div>

      <div className="space-y-8">
        {/* Video Player Section */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative group">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              className="w-full h-full object-contain"
              poster={onlineCase.coverImage || undefined}
            >
              您的浏览器不支持视频播放。
            </video>
          ) : (
             // Fallback to Cover Image if no video
             <div className="w-full h-full relative">
                {onlineCase.coverImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                    src={onlineCase.coverImage}
                    alt={onlineCase.title}
                    className="w-full h-full object-contain bg-muted"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        暂无视频/图片
                    </div>
                )}
                {!videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                            此案例暂无直接播放源，请访问原网页观看
                        </span>
                    </div>
                )}
             </div>
          )}
        </div>

        {/* Title Section */}
        <div className="space-y-4 max-w-4xl mx-auto text-left">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl line-clamp-1">
            {onlineCase.title}
          </h1>
          <div className="flex items-center justify-start gap-2 text-muted-foreground">
            <span className="uppercase tracking-wider text-sm font-semibold text-primary">
                {onlineCase.platform}
            </span>
            <span>•</span>
            <span className="text-sm">
                {onlineCase.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Details Section */}
        {displayDescription && (
            <div className="bg-muted/30 rounded-2xl p-8 border max-w-4xl mx-auto">
                <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-muted-foreground/80 whitespace-pre-wrap">
                    {displayDescription}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
