const XLSX = require('xlsx');
const path = require('path');

const filePath = 'e:\\KnowledgeBase\\模块 2：展项类型体系.xlsx';
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);

console.log(JSON.stringify(data, null, 2));
