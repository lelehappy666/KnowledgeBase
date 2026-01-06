'use client'

import { Canvas } from '@react-three/fiber'
import { useGLTF, Stage, PresentationControls } from '@react-three/drei'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

export function Exhibit3DViewer({ url }: { url: string }) {
  return (
    <div className="w-full h-full min-h-[400px] bg-muted/20 rounded-xl overflow-hidden relative">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">加载 3D 模型...</span>
        </div>
      }>
        <Canvas dpr={[1, 2]} camera={{ fov: 45 }} style={{ position: 'absolute' }}>
          <color attach="background" args={['#f0f0f0']} />
          <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
            <Stage environment="city">
              <Model url={url} />
            </Stage>
          </PresentationControls>
        </Canvas>
      </Suspense>
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded">
        交互：拖拽旋转 / 滚轮缩放
      </div>
    </div>
  )
}
