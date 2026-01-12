# TASK_behance_analysis

## 1. 任务列表

### 任务 1: 修正 BehanceParser 图片选择器 (V5)
- **文件**: `kb-web/src/lib/parsers/behance.ts`
- **描述**: 
    - 策略 B 更新: 直接查找类名 `.ImageElement-root-kir` (包含 `ImageElement-blockPointerEvents-Rkg`)。
    - 理由: 目标元素与 `inner-wrap` 是兄弟关系，直接查找目标元素更稳定。
    - 提取: 内部 `img` 的 `src`。

### 任务 2: 验证
- **文件**: `kb-web/scripts/test_behance_standalone.js`
- **描述**: 
    - 更新 Mock HTML，模拟用户提供的兄弟节点结构。
    - 运行脚本验证。

## 2. 执行顺序
1 -> 2
