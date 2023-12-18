import { parse } from 'csv-parse';
import fs from 'fs';

const csvParser = async (filename: string, headers: string[]) => new Promise<any[]>((resolve, reject) => {
    const rows: any[] = [];
    fs.createReadStream(filename)
      .pipe(parse({ delimiter: ',', from_line: 2}))
      .on('data', (row) => {
        const parsedRow: any = {};
        row.forEach((value: any, index: any) => {
          const header = headers[index];

          if (header === 'foodId' || header === 'activityId') {
            parsedRow[header] = parseInt(value, 10);
          } else if (
            header === 'calories'
            || header === 'proteins'
            || header === 'fat'
            || header === 'carbohydrate'
            || header === 'calPerHour'
          ) {
            parsedRow[header] = parseInt(value, 10);
          } else {
            parsedRow[header] = value;
          }
        });
        rows.push(parsedRow);
      })
      .on('end', () => {
        // All rows have been read
        resolve(rows);
      })
      .on('error', (error) => {
        // Handle errors
        reject(error);
      });
  })

export default csvParser;