import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
const __dirname = path.resolve(path.dirname(''));

async function updateTokenCards() {
  const outputFilePath = path.join(__dirname, 'data', 'token_cards.json');

  try {
    // Read the existing data from the file
    let existingCardsData = [];
    if (fs.existsSync(outputFilePath)) {
      const fileContent = fs.readFileSync(outputFilePath, 'utf-8');
      if (fileContent.trim()) {
        existingCardsData = JSON.parse(fileContent);
      }
    }

    const fetchingCards = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?misc=yes", {
        "headers": {
          "accept": "application/json, text/javascript, */*; q=0.01",
          "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,bg;q=0.6",
          "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://ygoprodeck.com/card-database/?&format=goat&sort=name&num=24&offset=0",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
  
    const response = await fetchingCards.json();

    // Iterate over API response data
    response.data.forEach((apiCard, index) => {
      // Check if the card type is 'Token'
      if (apiCard.type === 'Token') {
        // Add the token card to the array
        existingCardsData.push({
            "id": index,
            "type": apiCard.type,
            "name": apiCard.name,
            "englishAttribute": apiCard.attribute.toLowerCase(),
            "localizedAttribute": apiCard.attribute,
            "effectText": apiCard.desc,
            "level": apiCard.level,
            "atk": apiCard.atk,
            "def": apiCard.def,
            "properties": [
                apiCard.race,
                "Effect"
            ],
            "cardImage": apiCard.card_images[0].image_url,
            "frameType": apiCard.frameType,
            "archetype": apiCard.archetype,
            "ocg_date": apiCard.ocg_date,
            "tcg_date": apiCard.tcg_date
        });

        console.log(existingCardsData, 'apicard!')
      }
    });

    // Write the modified array back to the file
    fs.writeFileSync(outputFilePath, JSON.stringify(existingCardsData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error updating token cards:', error);
  }
}

// {
//     "id": 11992,
//     "type": "monster",
//     "name": "Graydle Dragon",
//     "englishAttribute": "water",
//     "localizedAttribute": "WATER",
//     "effectText": "1 Aqua-Type Tuner + 1 or more non-Tuner monsters\nWhen this card is Synchro Summoned: You can target cards your opponent controls, up to the number of WATER monsters used for the Synchro Summon of this card; destroy them. If this card is destroyed by battle or card effect and sent to the Graveyard: You can target 1 other WATER monster in your Graveyard; Special Summon it, but its effects are negated. You can only use each effect of \"Graydle Dragon\" once per turn.",
//     "level": 8,
//     "atk": 3000,
//     "def": 2000,
//     "properties": [
//       "Aqua",
//       "Synchro",
//       "Effect"
//     ],
//     "releaseDate": "2015/11/06",
//     "cardImage": "https://raw.githubusercontent.com/yugioh-artworks/artworks-en-n.ygorganization.com/main/1/19/92_1.png",
//     "frameType": "synchro",
//     "archetype": "Graydle",
//     "ocg_date": "2015-07-18",
//     "tcg_date": "2015-11-05",
//     "formats": [
//       "Duel Links",
//       "TCG",
//       "OCG"
//     ]
//   }

// Call the function
updateTokenCards();
