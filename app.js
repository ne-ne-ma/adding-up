'use strict';
// ファイルを扱うためのモジュール
const fs = require('fs');
// ファイルを一行ずつ読み込むためのモジュール
const readline = require('readline');
// Streamは非同期で情報を扱うための概念
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {}});
// 集計データを格納するための連想配列
const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
  // カンマで分割して配列で格納
  const columns = lineString.split(',');
  // 文字列を整数値に変換する関数
  const year = parseInt(columns[0]);
  const prefecture = columns[2];
  const popu = parseInt(columns[7]);
  if (year === 2010 || year === 2015) {
    let value = map.get(prefecture);
    // 初期値がない場合は0を代入
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }

    if (year === 2010) {
      value.popu10 += popu;
    }

    if (year === 2015) {
      value.popu15 += popu;
    }

    map.set(prefecture, value);
  }
});

rl.resume();
rl.on('close', () => {
  for (let pair of map) {
    const value = pair[1];
    value.change = value.popu15 / value.popu10;
  }

  const rankingArray = Array.from(map).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });

  const rankingString = rankingArray.map((pair) => {
    return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率' + pair[1].change;
  });
  console.log(rankingString);
});
