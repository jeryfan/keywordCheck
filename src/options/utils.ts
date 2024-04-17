import { read, utils, write } from 'xlsx';
import { saveAs } from 'file-saver';


export const xlsxRead = async (file): Promise<{ data: Array<{ name: string }> | undefined; error: undefined | Error }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const data = event.target.result;
            const workbook = read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0]; // 默认读取第一个工作表
            const jsonData = utils.sheet_to_json(workbook.Sheets[sheetName]);
            resolve({ data: jsonData, error: undefined })
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            reject({ error, data: undefined });
        };
        reader.readAsArrayBuffer(file);
    })

}


export const exportXlsx = (data) => {
    const ws = utils.json_to_sheet(data);

    // 创建一个工作簿
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1'); // 第二个参数是工作表的名字

    // 写入Excel文件（内存中）
    const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });

    // 创建Blob对象并下载
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'export.xlsx');

}