import fetch from 'node-fetch';
//https://raw.githubusercontent.com/yugioh-artworks/artworks-en-n.ygorganization.com/main/0/99/99_1.png
//I must remove the last slash '/' and it will be the card's ID. This way I will be able to map it
//import ALL_CARDS_DATA from "./cardsData.js";
const baseUrl = 'https://github.com/db-ygorganization-com/yugioh-card-history/blob/main/en/';
const fileUrls = [];
const extraCardInfoUrl = 'https://github.com/yugioh-neuron-data/tcg-android/tree/main/table/MstCardInfo/en/';
const extraCardFileUrls = [];
const ALL_CARDS_DATA = [];

for (let i = 14490; i <= 14599/*19392*/; i++) {
  const fileUrl = `${baseUrl}${i}.json`;
  const extraUrl = `${extraCardInfoUrl}${i}.json`;
  fileUrls.push(fileUrl);
  extraCardFileUrls.push(extraUrl);
}

async function loadJsonFiles(fileUrls) {
  const promises = fileUrls.map(async (fileUrl) => {
    try {
      const response = await fetch(fileUrl, { timeout: 8000 });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error loading ${fileUrl}: ${error}`);
      return null;
    }
  });

  return Promise.all(promises);
}

// async function loadJsonFiles(fileUrls, maxRetries = 3, retryDelay = 1000) {
//   const promises = fileUrls.map(async (fileUrl) => {
//     let retries = 0;

//     while (retries < maxRetries) {
//       try {
//         const response = await fetch(fileUrl);
//         if (response.ok) {
//           const data = await response.json();
//           return data;
//         }
//       } catch (error) {
//         console.error(`Error loading ${fileUrl}: ${error.message}`);
//       }

//       retries++;
//       await new Promise((resolve) => setTimeout(resolve, retryDelay));
//     }

//     console.error(`Failed to load ${fileUrl} after ${maxRetries} retries.`);
//     return null;
//   });

//   return Promise.all(promises);
// }


async function processData() {
  try {
    const [cardResults, extraCardResults] = await Promise.all([
      loadJsonFiles(fileUrls),
      loadJsonFiles(extraCardFileUrls),
    ]);

    if (cardResults.length !== extraCardResults.length) {
      console.error('Arrays have different lengths');
      return;
    }

    for (let i = 0; i < cardResults.length; i++) {
      const cardData = cardResults[i];
      const extraCardData = extraCardResults[i];
   
      if (!cardData || !extraCardData) {
        continue;
      }
      const rawLinesCardData = cardData.payload.blob.rawLines;
      const rawLinesExtraCardData = extraCardData.payload.blob.rawLines;

      if (rawLinesCardData && rawLinesExtraCardData && Array.isArray(rawLinesCardData)) {
        const jsonStringCardData = rawLinesCardData.join('');
        const jsonStringExtraCardData = rawLinesExtraCardData.join('');
        try {
          const cardData = JSON.parse(jsonStringCardData);
          const extraCardData = JSON.parse(jsonStringExtraCardData)
          cardData.releaseDate = extraCardData.sales_at;

          let cardImg;
          const id = cardData.id;
          if (id < 10000) {
            const numberForImageURL = convertNumber(id);
            cardImg = `https://raw.githubusercontent.com/yugioh-artworks/artworks-en-n.ygorganization.com/main/0/${
              numberForImageURL}_1.png`
          }
          if (id >= 10000) {
            const numberForImageURL = convertToSlashedNumber(id);
            cardImg = `https://raw.githubusercontent.com/yugioh-artworks/artworks-en-n.ygorganization.com/main/${
              numberForImageURL
            }_1.png`
          }
          cardData.cardImage = cardImg;
          ALL_CARDS_DATA.push(cardData);
          // Now, `cardData` contains the card information
          console.log('Card Data:', cardData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
   
      // Merge properties from extraCardData into cardData
      //cardData.sales_at = extraCardData.sales_at;
      //console.log('Merged Data:', cardData);
    }
  } catch (error) {
    console.error('Error loading JSON files:', error);
  }
}
processData();
//for less than 10000
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
  // Convert the number to a string
  const numberString = normalNumber.toString();
  // Check if the string contains at least 5 characters
  if (numberString.length >= 5) {
    // Split the string into parts
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
    // If the input number is too short, return it as is
    return numberString;
  }
}

// 40/7 this is 4007 
// 40/10 this is 4010
// 41/0 this is 4100
// 70/0 this is 7000
// 1/0/0 this is 10000
// 1/5/99 this is 10599 
// 1/1/0 this is 10100
// 1/1/1 this is 10101
// 1/1/20 this is 10120
// 1/1/99 this is 10199
// 1/10/0 this is 11000
// 1/10/99 this is 11099
// 1/10/9 this is 11009
// 1/11/0 this is 11100
// 1/11/1 this is 11101
// 1/12/0 this is 11200
// 1/15/2 this is 11502
// 1/15/19 this is 11519
// 1/35/19 this is 13519
function exportData() {
  console.log('ASD ASDDSA', ALL_CARDS_DATA); // Now the data is available
}

export default ALL_CARDS_DATA;
export { exportData, processData };