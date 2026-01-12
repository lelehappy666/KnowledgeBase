const cheerio = require('cheerio');

const html = `<div data-v-a142a97a="" data-v-2ec8983b="" class="intro-content">“第三自然”是在未来科技与生态智慧深度融合的背景下，人类不再是对自然的单向度改造与征服，而是人、智能机器（AI与机器人）、以及自然生命（动植物、微生物乃至生态系统）三者之间，通过深度互联、智能交互与共生演化，所共同涌现出的一个全新的、自组织的复杂系统。它超越了“原生”与“人造”的二元对立，是一个混合的、共生的、具有某种“灵性”或“主体性”具有更高复杂性、智能与生命力的新型共同体。<br><br>我们正致力于构建一个全新的空间形态——它根植于“第三自然”的哲学基底，不再是被动观赏的景观容器，而是一个全域流动、信息赋能的生命共同体。<br>这里没有孤立的装置，只有彼此联结、呼吸共振的生态节点。我们以信息为脉络，让虚拟与现实在此共生共长，让空间的每一寸肌理都承载“与生活、与自然对话”的使命。空间中的每次发生都是与空间的对话，通过持续的信息交互感知多维延展、沉淀，构建起“体验—收集—管理—再生成”的信息自主进化交互场。<br></div>`;

function parse(htmlContent) {
    // Simulate what we do in the parser
    // We load the inner content of the div usually, but here we have the div itself.
    // The API returns the inner HTML usually? Or the outer?
    // User said: "In this paragraph... the description is... Then the full content is..."
    // The user provided the OUTER HTML of the div. 
    // But the API `introduction` field usually contains the INNER HTML or the fragment.
    // Let's assume we load the whole string provided.
    
    const $ = cheerio.load(htmlContent);
    
    // Current Logic in mana.ts
    
    // 1. Replace <br> with newlines
    $('br').replaceWith('\n');
    
    // 2. Ensure paragraphs are separated by newlines
    $('p').after('\n\n');

    // 3. Get text from body
    // Note: Since we loaded the full div, the text is inside div.intro-content
    // But in the real app, we load `data.introduction`.
    // If data.introduction IS the div, then text is inside body > div
    // If data.introduction IS the inner html, then text is inside body
    
    // Let's try to grab text from root
    let description = $.text(); 
    
    // 4. Clean up
    description = description.replace(/\n\s*\n/g, '\n\n').trim();
    
    return description;
}

const result = parse(html);
console.log("--- PARSED RESULT ---");
console.log(result);
console.log("---------------------");
console.log("Length:", result.length);
console.log("Contains '第三自然':", result.includes("第三自然"));
console.log("Contains '灵性':", result.includes("灵性"));
console.log("Contains '自组织的复杂系统':", result.includes("自组织的复杂系统"));
