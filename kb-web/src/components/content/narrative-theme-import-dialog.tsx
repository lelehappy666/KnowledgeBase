'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { createNarrativeThemeAction } from '@/app/actions/narrative-theme'
import { toast } from 'sonner'
import { FileJson, Copy, Loader2, AlertCircle, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const exampleJson = {
  "name": "能源革命：从化石到未来",
  "basic": {
    "id": "THEME_ENERGY_001",
    "aliases": ["能源变革", "能源未来"],
    "icon": "energy-icon.png",
    "color": "#4CAF50",
    "slogan": "绿色能源，点亮未来",
    "abstract": "探索从化石能源到可再生能源的转变历程，展示人类文明与能源利用的演进关系。",
    "attributes": {
      "type": "科学主题",
      "scale": "大型主题",
      "timeliness": "长期主题",
      "importance": "重点主题",
      "urgency": "高"
    },
    "relations": {
      "subjects": ["物理", "化学", "地理", "经济"],
      "domains": ["环境科学", "工程技术"],
      "sdgs": ["目标7:经济适用的清洁能源", "目标13:气候行动"],
      "keywords": ["可再生能源", "碳中和", "清洁能源"]
    }
  },
  "structure": {
    "framework": {
      "type": "时间线叙事",
      "perspective": "人类视角",
      "rhythm": "起伏跌宕",
      "emotionCurve": "",
      "goal": "让观众理解能源转型的必要性和可能性"
    },
    "stages": [
      { "name": "能源过去", "desc": "化石能源时代", "duration": 5 },
      { "name": "能源危机", "desc": "转折点与挑战", "duration": 10 },
      { "name": "能源未来", "desc": "清洁能源愿景", "duration": 15 }
    ],
    "points": {
      "turning": ["工业革命", "石油危机", "巴黎协定"],
      "climax": "沉浸式体验未来100%可再生能源场景",
      "ending": "号召观众参与能源转型行动"
    },
    "elements": {
      "protagonist": "人类文明",
      "conflict": "能源需求增长与环境保护的矛盾",
      "suspense": ["化石能源还能用多久?", "核聚变何时实现?"],
      "metaphor": ["能源是文明的血液", "太阳是终极能源"],
      "quotes": ["没有能源，就没有文明", "阳光免费，技术不免费"]
    },
    "cognition": {
      "start": "知道能源重要，但不了解具体类型",
      "goal": "理解各类能源特点及转型路径",
      "ladder": [
        { "level": 1, "cognition": "识别能源类型", "activity": "能源分类互动" },
        { "level": 2, "cognition": "理解碳排放", "activity": "碳足迹计算" }
      ],
      "obstacles": ["能源技术过于专业", "转型成本难以理解"],
      "breakthroughs": ["用生活类比", "可视化成本效益"]
    }
  },
  "configuration": {
    "exhibits": {
      "suitableTypes": [],
      "functionTable": [{ "type": "可视化展项", "func": "数据展示" }],
      "combinations": [{ "name": "能源概览", "exhibits": [] }],
      "core": [],
      "auxiliary": []
    },
    "layout": {
      "space": "大型展区",
      "area": 500,
      "type": "线性流线",
      "flowChart": "",
      "zones": [{ "name": "过去展区", "func": "历史回顾" }],
      "focus": ["入口:能源时间轴", "中心:全球能源地图"],
      "transition": "用能源管道造型连接不同展区",
      "restPoints": [{ "location": "转型挑战区后", "func": "反思区" }]
    },
    "examples": {
      "visual": [],
      "mechanical": [],
      "data": [],
      "immersive": [],
      "interactive": [],
      "art": []
    }
  },
  "content": {
    "framework": {
      "core": ["能源转型不可避免", "可再生能源是未来"],
      "data": [{ "label": "全球能源消耗", "value": "..." }],
      "concepts": [{ "name": "碳中和", "desc": "..." }],
      "stories": [{ "person": "特斯拉", "story": "..." }],
      "timeline": [{ "time": "1765", "event": "蒸汽机发明" }],
      "geography": [{ "region": "中东", "feature": "石油丰富" }]
    },
    "levels": {
      "l1": ["能源类型", "转型必要性"],
      "l2": ["各种能源优缺点", "转型挑战"],
      "l3": ["技术细节", "政策分析"],
      "l4": ["技术参数", "学术争议"]
    },
    "carriers": {
      "boards": "20-30块",
      "videos": [{ "type": "科普动画", "duration": 3 }],
      "interactive": [{ "func": "能源选择", "interface": "触摸屏" }],
      "objects": [{ "name": "太阳能板", "type": "实物" }],
      "visualization": [{ "data": "能源结构", "form": "动态饼图" }]
    },
    "tactics": {
      "suspense": ["2100年能源什么样?"],
      "contrast": ["过去vs现在", "化石vs再生"],
      "analogy": ["电网像血管", "储能像水库"],
      "plot": "从钻木取火到核聚变的人类能源之旅",
      "resonance": ["儿童未来视角", "家乡能源故事"]
    }
  },
  "experience": {
    "goals": {
      "cognitive": "理解能源的过去、现在和未来",
      "emotional": "对能源问题的紧迫感和责任感",
      "behavioral": "尝试计算个人碳足迹并承诺减排",
      "social": "与同伴讨论能源选择，形成共识"
    },
    "design": {
      "senses": [{ "sense": "视觉", "experience": "多彩能源地图" }],
      "rhythm": "先快节奏概览，后慢节奏深思",
      "surprise": ["突然的黑暗体验能源短缺"],
      "memory": ["手摇发电体验", "未来能源承诺墙"],
      "photo": ["与巨大太阳能板合影"]
    },
    "interaction": {
      "observation": [],
      "operation": [],
      "inquiry": [],
      "creation": [],
      "share": []
    },
    "participation": {
      "individual": 3,
      "group": 4,
      "family": 4,
      "community": 2,
      "continuous": "扫码加入能源社群，持续学习"
    },
    "emotion": {
      "start": "好奇",
      "path": "好奇→震惊→思考→希望→行动",
      "climax": "沉浸式体验能源枯竭的震撼",
      "end": "行动",
      "memory": "能源问题与我息息相关，我可以有所作为"
    }
  },
  "evaluation": {
    "indicators": {
      "understanding": 0.85,
      "satisfaction": 0.9,
      "duration": 45,
      "depth": "3.8/5",
      "behaviorChange": 0.4,
      "socialShare": 0.65
    },
    "methods": {
      "observation": "观察观众在转折点的表情变化",
      "interview": "",
      "questionnaire": "",
      "tracking": ["WiFi探针", "摄像头分析"],
      "focusGroup": ""
    },
    "iteration": {
      "versions": [{ "version": "2.0", "change": "增加互动环节" }],
      "success": ["时间轴叙事清晰", "互动环节受欢迎"],
      "failure": ["数据展项过于复杂", "情感落点不明确"],
      "suggestions": "增加更多生活化案例，减少专业术语",
      "todos": ["情感高潮的效果", "行为改变的持续性"]
    },
    "references": {
      "similar": [],
      "global": [{ "country": "德国", "case": "能源转型展" }],
      "awards": [{ "award": "博物馆协会金奖", "case": "..." }],
      "academic": []
    },
    "status": {
      "maturity": "验证阶段",
      "count": 5,
      "agencies": ["上海科技馆", "中国科技馆"],
      "date": "2025-11-01",
      "report": ""
    }
  }
};

export function NarrativeThemeImportDialog() {
  const [open, setOpen] = useState(false)
  const [jsonStr, setJsonStr] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const router = useRouter()

  const handleImport = async () => {
    if (!jsonStr.trim()) return;
    
    setIsLoading(true)
    setError(null)

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(jsonStr)
      } catch (e) {
        throw new Error("JSON 格式错误: 请检查语法")
      }

      const res = await createNarrativeThemeAction(parsedData)
      
      if (res.success) {
        toast.success("叙事主题导入成功")
        setOpen(false)
        setJsonStr('')
        router.push('/content/narrative-themes')
        router.refresh()
      } else {
        throw new Error(res.error || "导入失败")
      }
    } catch (e: any) {
      setError(e.message)
      toast.error("导入失败")
    } finally {
      setIsLoading(false)
    }
  }

  const copyTemplate = () => {
    navigator.clipboard.writeText(JSON.stringify(exampleJson, null, 2))
    setIsCopied(true)
    toast.success("模板已复制到剪贴板")
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileJson className="mr-2 h-4 w-4" />
          快速导入
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-none">
          <DialogTitle className="flex items-center justify-between">
            <span>导入叙事主题</span>
            <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={copyTemplate}>
              {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span className="text-xs">复制模板</span>
            </Button>
          </DialogTitle>
          <DialogDescription>
            请粘贴符合格式的 JSON 数据。
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 py-4 overflow-y-auto">
          <Textarea 
            placeholder={`例如:\n${JSON.stringify(exampleJson, null, 2)}`}
            className="min-h-[300px] h-full font-mono text-xs resize-none placeholder:text-muted-foreground/40"
            value={jsonStr}
            onChange={(e) => setJsonStr(e.target.value)}
          />
          {error && (
              <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>错误</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}
        </div>
        <DialogFooter className="flex-none">
          <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={handleImport} disabled={isLoading || !jsonStr.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            确认导入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
