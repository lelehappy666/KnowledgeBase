const XLSX = require('xlsx');
const path = require('path');

const filePath = 'e:\\KnowledgeBase\\科学原理库.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log('All Rows:');
    data.forEach((row, index) => {
        console.log(`Row ${index}:`, row);
    });
} catch (error) {
    console.error('Error reading file:', error.message);
}
