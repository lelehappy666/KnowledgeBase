const XLSX = require('xlsx');
const path = require('path');

const filePath = 'e:\\KnowledgeBase\\技术可行性数据库.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log('Checking for unique rows...');
    data.forEach((row, index) => {
        // Print rows that might be group headers (usually first column has value, others might be empty or specific)
        if (row.length > 0 && row[0]) {
             console.log(`Row ${index}:`, JSON.stringify(row));
        }
    });
} catch (error) {
    console.error('Error reading file:', error.message);
}
