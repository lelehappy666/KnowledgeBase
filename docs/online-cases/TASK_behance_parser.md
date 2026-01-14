# TASK: Behance Parser Simplification (V8)

## 子任务列表

### 1. 更新测试脚本
*   文件: `scripts/test_behance_standalone.js`
*   内容:
    *   移除 GIF 测试用例。
    *   更新 Static Case HTML，确保包含用户指定的完整 Class。
    *   断言: 检查是否提取到了 `src` 属性的值。

### 2. 修改解析器代码
*   文件: `src/lib/parsers/behance.ts`
*   内容:
    *   删除/注释 GIF 解析逻辑。
    *   重写 `parse` 方法的核心查找逻辑：
        ```typescript
        const container = $('section.Project-projectModuleContainer-BtF.Preview__project--topMargin.project-module-container');
        const wrapper = container.find('.ImageElement-root-kir.ImageElement-blockPointerEvents-Rkg.ImageElement-loaded-icR');
        const img = wrapper.find('img');
        const src = img.attr('src');
        ```

### 3. 验证
*   运行 `node scripts/test_behance_standalone.js`。
*   确认输出符合预期。
