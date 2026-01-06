import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LogsPage() {
  const mockLogs = [
    { time: '2026-01-05 16:30:00', level: 'INFO', message: 'System started successfully.' },
    { time: '2026-01-05 16:35:12', level: 'INFO', message: 'User admin logged in.' },
    { time: '2026-01-05 16:40:45', level: 'WARN', message: 'Upload directory usage > 80%.' },
    { time: '2026-01-05 16:55:22', level: 'INFO', message: 'Exhibit "全息光影互动台" created.' },
    { time: '2026-01-05 17:10:00', level: 'ERROR', message: 'Failed to connect to NAS backup server.' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-8 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">系统日志</h1>
                <p className="text-muted-foreground mt-2">查看系统运行状态与操作记录。</p>
            </div>
            <Button variant="outline" asChild>
                <Link href="/admin">返回后台</Link>
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>最近日志</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-muted/20 font-mono text-sm">
                    {mockLogs.map((log, index) => (
                        <div key={index} className="mb-2 last:mb-0">
                            <span className="text-muted-foreground">[{log.time}]</span>{' '}
                            <span className={`${
                                log.level === 'INFO' ? 'text-blue-500' : 
                                log.level === 'WARN' ? 'text-yellow-500' : 'text-red-500'
                            } font-bold`}>
                                {log.level}
                            </span>:{' '}
                            <span>{log.message}</span>
                        </div>
                    ))}
                    <div className="text-muted-foreground mt-4 italic">
                        # End of current log stream (Mock Data)
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
