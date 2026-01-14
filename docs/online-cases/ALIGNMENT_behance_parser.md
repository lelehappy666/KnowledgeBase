# ALIGNMENT: Behance Parser Simplification (V8)

## 1. 需求分析
用户要求再次调整 Behance 解析规则，具体要求如下：
1.  **只保留图片**：移除 GIF 或其他媒体类型的解析逻辑。
2.  **特定 DOM 路径**：
    *   Container: `section.Project-projectModuleContainer-BtF.Preview__project--topMargin.project-module-container` (aria-label="Project Module 0")
    *   Target Wrapper: `.ImageElement-root-kir.ImageElement-blockPointerEvents-Rkg.ImageElement-loaded-icR`
    *   Target Image: `img` inside the wrapper.
    *   Attribute: `src`.

## 2. 变更点
*   **移除**：GIF 解析策略 (Strategy A)。
*   **更新**：静态图片解析策略 (Strategy B -> Sole Strategy)。
*   **精确匹配**：使用用户提供的完整 Class 字符串进行查找。

## 3. 疑问/确认
*   **Src vs Srcset**: 用户明确指出 "img 里的 src 就是图片的地址"。尽管通常 `srcset` 包含更高清图片，但根据指令，我们将 `src` 作为主要提取目标。为了保证质量，如果 `src` 存在，我们将提取它。(*技术注：为了防止 src 是低清图，保留 srcset 解析作为 hidden feature 可能是明智的，但必须确保逻辑首先满足“找到这个img”的要求。如果 src 是必须的，就取 src*)。
    *   **决策**：代码中将优先获取 `src`。如果 `src` 包含 `max_632` 等限制，且存在 `srcset`，作为“资深架构师”，我会在日志中记录，或者智能地替换为高清（如果用户之前的反馈是因为高清图加载失败？）。
    *   **最终决策**：严格遵照用户“src 就是图片地址”的指示。但为了防止获取到极小缩略图，我会保留 `srcset` 解析逻辑，但仅在 `src` 无效或用户再次要求高清时启用？不，用户在上一轮提供了 `max_632` 的 src 同时也提供了 `fs_webp` 的 srcset。上一轮我优先了 `srcset`。这一轮用户强调 `src`。
    *   **修正**：用户说“src就是图片地址”，可能是因为他只想简单获取一个能显示的地址。我会提取 `src`。但是，Behance 的 `src` 往往是 1400px 或 600px 的 webp/jpg，通常足够。

## 4. 验收标准
*   测试脚本能通过 Mock HTML 提取到 `src` 指定的 URL。
*   解析器不再输出 GIF 来源。
