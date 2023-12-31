//https://ipfs.filebase.io/ipfs/Qmc6KokAqLHEHqdfcaTk1hV3P8ZfLpM3DKePkAwwcQUv6t/0/40/11_1.png
//https://raw.githubusercontent.com/yugioh-artworks/artworks-en-n.ygorganization.com/main/0/40/11_1.png
//if github turns to be bad at hosting images and RPM, use the Filebase public bucket in the same way.
//Just replace the url and path, leave the file structure the same after the slash
//https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?forbiddenLimitedDate=2012-03-01
//^ to Fetch the forbidden/limited list - it is sorted from 2012 until present
//Add in my card objects for the cards.name if it matches with the one of the forbidden/limited list
//a new key:value pair that will list whether a card is limited/semi limited/forbidden for that period
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
const __dirname = path.resolve(path.dirname(''));

const baseUrl = 'https://github.com/db-ygorganization-com/yugioh-card-history/blob/main/en/';
const extraCardInfoUrl = 'https://github.com/yugioh-neuron-data/tcg-android/tree/main/table/MstCardInfo/en/';
const ALL_CARDS_DATA = [];
let fileUrls = [];
let extraCardFileUrls = [];
const startId = 18901; //change to new value 17401
const endId = 19000; //

const outputFilePath = path.join(__dirname, 'data', 'all_cards_data.json');

const delayBetweenRequests = 6000; // 5 seconds
const maxRetries = 1;
const retryDelay = 1000;

if (fs.existsSync(outputFilePath)) {
  const existingData = fs.readFileSync(outputFilePath, 'utf8');
  ALL_CARDS_DATA.push(...JSON.parse(existingData));
}

for (let i = startId; i <= endId; i++) {
  const fileUrl = `${baseUrl}${i}.json`;
  const extraUrl = `${extraCardInfoUrl}${i}.json`;
  fileUrls.push(fileUrl);
  extraCardFileUrls.push(extraUrl);
}

async function loadJsonFiles(fileUrls, maxRetries = 3) {
  const fetchWithRetries = async (url, retries) => {
    try {
      const response = await fetch(url, { timeout: 8000 });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error(`HTTP request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error(`Error loading ${url}: ${error}`);
      if (retries > 0) {
        console.log(`Retrying (${retries} retries remaining) in 15 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
        return fetchWithRetries(url, retries - 1);
      }
      return null;
    }
  };

  const promises = fileUrls.map(async (fileUrl) => {
    return fetchWithRetries(fileUrl, maxRetries);
  });

  return Promise.all(promises);
}

async function processData() {
  try {
      // const cardUrl = fileUrls;
      // const extraCardUrl = extraCardFileUrls;
      const [cardResults, extraCardResults] = await Promise.all([
        loadJsonFiles(fileUrls, maxRetries),
        loadJsonFiles(extraCardFileUrls, maxRetries),
      ]);

      if (cardResults.length !== extraCardResults.length) {
        console.error('Arrays have different lengths');
        return;
      }

      for (let i = 0; i < cardResults.length; i++) {
        const cardData = cardResults[i];
        const extraCardData = extraCardResults[i];
      // const cardData = await loadJsonFiles(cardUrl, maxRetries, retryDelay);
      // const extraCardData = await loadJsonFiles(extraCardUrl, maxRetries, retryDelay);

      if (cardData && extraCardData) {
        const rawLinesCardData = cardData.payload.blob.rawLines;
        const rawLinesExtraCardData = extraCardData.payload.blob.rawLines;

        if (rawLinesCardData && rawLinesExtraCardData && Array.isArray(rawLinesCardData)) {
          const jsonStringCardData = rawLinesCardData.join('');
          const jsonStringExtraCardData = rawLinesExtraCardData.join('');
          try {
            const parsedCardData = JSON.parse(jsonStringCardData);
            const parsedExtraCardData = JSON.parse(jsonStringExtraCardData);
            parsedCardData.releaseDate = parsedExtraCardData.sales_at;

            let cardImg;
            const id = parsedCardData.id;
            if (id < 10000) {
              const numberForImageURL = convertNumber(id);
              cardImg = `https://raw.githubusercontent.com/yugioh-artworks/artworks-en-n.ygorganization.com/main/0/${numberForImageURL}_1.png`;
            }
            if (id >= 10000) {
              const numberForImageURL = convertToSlashedNumber(id);
              cardImg = `https://raw.githubusercontent.com/yugioh-artworks/artworks-en-n.ygorganization.com/main/${numberForImageURL}_1.png`;
            }
            parsedCardData.cardImage = cardImg;
            ALL_CARDS_DATA.push(parsedCardData);

            // Save ALL_CARDS_DATA to the output file
            fs.writeFileSync(outputFilePath, JSON.stringify(ALL_CARDS_DATA, null, 2), 'utf-8');
            //fs.writeFileSync(outputFilePath, JSON.stringify(ALL_CARDS_DATA), 'utf-8');
            console.log(`Card Data for ID ${id} processed and saved.`);

          } catch (error) {
            console.error(`Error parsing JSON for ID ${id}: ${error}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing data:', error);
  }
}

function convertNumber(number) {
    const num = parseInt(number);
    if (isNaN(num) || num < 1000 || num > 19000) {
      return 'Invalid input';
    }
    let result = '';
  
    if (num >= 1000 && num < 10000) {
      const firstPart = Math.floor(num / 100);
      const secondPart = num % 100;
      result = `${firstPart}/${secondPart}`;
    }
    return result;
}

//for 10000 or more
function convertToSlashedNumber(normalNumber) {
  const numberString = normalNumber.toString();
  if (numberString.length >= 5) {
    const part1 = numberString.slice(0, 1);
    const part2 = numberString.slice(1, 3);
    const part3 = numberString.slice(3);
    
    let arrOfNums = [part1, part2, part3];
    for (var i=0; i < arrOfNums.length; i++) {
      if (arrOfNums[i].indexOf('00') !== -1) {
        arrOfNums[i] = arrOfNums[i].slice(1)
      }
    } 

    if (arrOfNums[1].length === 2 && arrOfNums[1][0] === '0' &&
      arrOfNums[1][1] !== '0') {
      arrOfNums[1] = arrOfNums[1].slice(1);
    }

    if (arrOfNums[2][0] === '0') {
      arrOfNums[2] = arrOfNums[2].slice(1);
    }
    if (!arrOfNums[2]) {
      arrOfNums[2] = '0';
    }
    const slashedNumber = `${arrOfNums[0]}/${arrOfNums[1]}/${arrOfNums[2]}`;
    
    return slashedNumber;
  } else {
    return numberString;
  }
}

processData();