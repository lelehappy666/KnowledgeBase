# FINAL_behance_analysis

## 项目总结
实现了支持 GIF 和静态图片双重策略的 Behance 链接解析器，并针对静态图片更新了精确的 DOM 解析路径（V4 版本，更通用的类名匹配）。

## 关键特性
1.  **双重封面解析策略**:
    -   **优先级 1 (GIF/动态)**: 查找属性 `data-ut="project-module-source-original"`，解析 `srcset` 获取最高清动态图。
    -   **优先级 2 (静态图片)**: 按照用户指定的 DOM 路径解析：
        -   容器: `.project-module-image-inner-wrap.js-module-container-reference.Image-container-z3a`
        -   元素: `.ImageElement-root-kir.ImageElement-blockPointerEvents-Rkg.ImageElement-loaded-icR` (不限制为 `a` 标签，只要类名匹配)
        -   图片: `img` -> `src`
    -   **优先级 3 (Fallback)**: 使用 Open Graph (`og:image`) 元数据。
2.  **调试报告**:
    -   解析结果中包含 `rawDescription` 字段，详细列出了命中的策略、提取到的地址和原始链接，方便在 UI 中直接核对。

## 修改文件
-   `kb-web/src/lib/parsers/behance.ts` (核心逻辑更新)
-   `kb-web/scripts/test_behance_standalone.js` (测试用例更新)

## 使用方法
API 请求:
```json
{
  "url": "https://www.behance.net/gallery/...",
  "platform": "BEHANCE"
}
```
响应中的 `description` 字段为空，请查看 `content` -> `rawDescription` 获取调试信息。
