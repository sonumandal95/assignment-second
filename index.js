const fs = require('fs');
const path = require('path');
const { parse } = require('fast-csv');

async function pickFriuts(path) {
  let pickingFruits = { 'Future2': [], 'Future5': [], 'Future8': [] };
  fs.createReadStream(path)
    .pipe(parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
      let numberOfFuture = 0;
      let sumOfFruitsSize = 0;
      // average fruit size
      for (key in row) {
        if (key.toString().startsWith('Future')) {
          numberOfFuture++;
          sumOfFruitsSize += parseFloat(row[key]);
        }
      }
      row['AvgFruitSize'] = parseFloat(sumOfFruitsSize/numberOfFuture).toString();

      if (row['Future2'] > 70) pickingFruits['Future2'].push(row);
      else if (row['Future5'] >= 70) pickingFruits['Future5'].push(row);
      else pickingFruits['Future8'].push(row);

      // average fruit size on picking
      numberOfFuture = 0;
      sumOfFruitsSize = 0;
      for (key in row) {
        if (key.toString().startsWith('Future')) {
          numberOfFuture++;
          sumOfFruitsSize += parseFloat(row[key]);
        }
        if (key === 'Future2' && row['Future2'] > 70) {
          row['AvgFruitSizeOnPicking'] = parseFloat(sumOfFruitsSize/numberOfFuture).toString();
          break;
        }
        else if (key === 'Future5' && row['Future2'] >= 70) {
          row['AvgFruitSizeOnPicking'] = parseFloat(sumOfFruitsSize/numberOfFuture).toString();
          break;
        }
        else if (key === 'Future9') {
          row['AvgFruitSizeOnPicking'] = parseFloat(sumOfFruitsSize/numberOfFuture).toString();
        }
      }
    })
    .on('end', function () {
      console.log(pickingFruits)
      fs.createWriteStream('pickingFruits.json').write(JSON.stringify(pickingFruits));
    });
}

pickFriuts(path.resolve('./assets/ORRIR01C-test.csv'));
