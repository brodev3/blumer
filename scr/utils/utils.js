const fs = require('fs');
const log = require("./logger");
const path = require('path');

const userAgents = [
  "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 9; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4953.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; OnePlus 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; Mi 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; LG V60 ThinQ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; Samsung Galaxy S20 Ultra) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; Sony Xperia 1 III) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 9; HTC U12+) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4953.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 12; OnePlus 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; Google Pixel 4a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4953.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; Xiaomi Redmi Note 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; Samsung Galaxy S21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 12; Sony Xperia 5 III) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 9; Google Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4953.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; OnePlus 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; Samsung Galaxy S20) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; Xiaomi Mi 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 12; Google Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.99 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 9; Huawei P30 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4953.99 Mobile Safari/537.36"
];

let get_AccountsData = function () {
  try {
      const data = fs.readFileSync(path.resolve(__dirname, '..') + "/config.json", 'utf8');
      const jsonData = JSON.parse(data);
      return jsonData;
      } catch (error) {
        log.error(error);
        throw error;
    };
};

let write_AccountsData = function (data) {
    try {
      fs.writeFileSync(path.resolve(__dirname, '..') + "/config.json", JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
        log.error(error);
        throw error;
    };
};

let get_UA = function () {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

module.exports.get_AccountsData = get_AccountsData;
module.exports.write_AccountsData = write_AccountsData;
module.exports.get_UA = get_UA;