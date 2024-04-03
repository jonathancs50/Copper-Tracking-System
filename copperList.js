const fs = require('fs');
const csv = require('csv-parser');

function readCsvFile(filePath, delimiter = ';') {
    return new Promise((resolve, reject) => {
        const data = [];
        
        // Read the CSV file
        fs.createReadStream(filePath)
            .pipe(csv({ separator: delimiter })) // Use specified delimiter
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

module.exports = readCsvFile;
