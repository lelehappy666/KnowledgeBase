const XLSX = require('xlsx');
const path = require('path');

const filePath = 'e:\\KnowledgeBase\\模块 2：展项类型体系.xlsx';
const workbook = XLSX.readFile(filePath);
console.log('SheetNames:', workbook.SheetNames);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
// header: 1 means array of arrays
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log(JSON.stringify(data.slice(0, 5), null, 2));
