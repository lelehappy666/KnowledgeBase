import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Menu, Package2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Package2 className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block text-lg tracking-tight">
              展品知识库
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/cognitive"
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              展品展项认知基础库
            </Link>
            <Link
              href="/content-lib"
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              展项内容知识库
            </Link>
            <Link
              href="/engineering"
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              展品技术与工程知识库
            </Link>
            <Link
              href="/methodology"
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              展项研发方法论
            </Link>
            <Link
              href="/gallery"
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              浏览展品
            </Link>
            <Link
              href="/admin"
              className="transition-colors hover:text-primary text-foreground/60 font-medium"
            >
              管理后台
            </Link>
          </nav>
        </div>
        
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
             <Link className="flex items-center gap-2 mb-8" href="/">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">展品知识库</span>
            </Link>
            <nav className="flex flex-col gap-4 px-2">
              <Link href="/cognitive" className="text-lg font-medium">展品展项认知基础库</Link>
              <Link href="/content-lib" className="text-lg font-medium">展项内容知识库</Link>
              <Link href="/engineering" className="text-lg font-medium">展品技术与工程知识库</Link>
              <Link href="/methodology" className="text-lg font-medium">展项研发方法论</Link>
              <Link href="/gallery" className="text-lg font-medium">浏览展品</Link>
              <Link href="/admin" className="text-lg font-medium text-primary">管理后台</Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索展品..."
                className="pl-8 h-9 md:w-[300px] lg:w-[400px] bg-muted/50 focus-visible:ring-primary"
              />
            </div>
          </div>
          <Button size="sm" className="hidden md:flex">登录</Button>
        </div>
      </div>
    </header>
  );
}
