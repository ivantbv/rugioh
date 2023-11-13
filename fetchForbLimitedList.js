//https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?forbiddenLimitedDate=2012-03-01
//^ to Fetch the forbidden/limited list - it is sorted from 2012 until present
//Add in my card objects for the cards.name if it matches with the one of the forbidden/limited list
//a new key:value pair that will list whether a card is limited/semi limited/forbidden for that period
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import cheerio from 'cheerio';

const __dirname = path.resolve(path.dirname(''));

//const baseUrl = 'https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?forbiddenLimitedDate=';
const baseUrl = 'https://www.yugioh-card.com/eu/play/forbidden-and-limited-list/?listid=22' //'2011-09-01'
const forbiddenLimitedDate = '2011-03-01' //try to find banlist before 2012 year
let fileUrls = [];

const outputFilePath = path.join(__dirname, 'data', 'forbidden_limited_list.json');

const delayBetweenRequests = 6000; // 6 seconds
const maxRetries = 1;
const retryDelay = 1000;

// if (fs.existsSync(outputFilePath)) {
//   const existingData = fs.readFileSync(outputFilePath, 'utf8');
//   // Assuming FORBIDDEN_LIMITED_LIST is an array
//   const existingList = JSON.parse(existingData);
//   // Append existing data to FORBIDDEN_LIMITED_LIST
//   FORBIDDEN_LIMITED_LIST.push(...existingList);
// }

// Function to append data to the JSON file
function appendToJsonFile(data) {
    let existingData = [];

    if (fs.existsSync(outputFilePath)) {
        const fileContent = fs.readFileSync(outputFilePath, 'utf8');
        if (fileContent.trim() !== '') {
            existingData = JSON.parse(fileContent);
        }
    }

    existingData.push(data);

    fs.writeFileSync(outputFilePath, JSON.stringify(existingData, null, 2), 'utf8');
}


async function loadHtml(url, retries) {
    try {
        const response = await fetch(url, { timeout: 8000 });
        const contentType = response.headers.get('content-type');

        if (response.ok && contentType && contentType.includes('text/html')) {
            const html = await response.text();
            return html;
        } else {
            console.error(`HTTP request failed with status ${response.status}, Content type: ${contentType}`);
            throw new Error(`HTTP request failed with status ${response.status}`);
        }
    } catch (error) {
        console.error(`Error loading ${url}: ${error}`);
        if (retries > 0) {
            console.log(`Retrying (${retries} retries remaining) in 15 seconds...`);
            await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
            return loadHtml(url, retries - 1);
        }
        return null;
    }
}

async function processForbiddenList(){
    try {

 
        const fetchForbiddenList = await fetch(`https://ygoprodeck.com/api/banlist/getBanList.php?list=TCG&date=${forbiddenLimitedDate}`, {
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
    "referrer": "https://ygoprodeck.com/banlist/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
    });

    const responseForbiddenList = await fetchForbiddenList.json();

    // console.log(responseForbiddenList, 'list forb')

    let forbiddenList = [];
    let limitedList = [];
    let semiLimitedList = [];
    
    responseForbiddenList.forEach(card => {
        if (card.status_text === 'Banned') {
            forbiddenList.push(card.name)
        } 
        if (card.status_text === 'Limited') {
            limitedList.push(card.name)
        }
        if (card.status_text === 'Semi-Limited') {
            semiLimitedList.push(card.name)
        }
    })
     const data = {
                [forbiddenLimitedDate]: {
                    forbiddenList,
                    limitedList,
                    semiLimitedList,
                },
            };
    
            console.log('Data to be appended:');
            console.log(data);
    
           appendToJsonFile(data);
        } catch(error) {
            console.error('Error processing data:', error);
        }

}
processForbiddenList();


async function processFLData() {
    try {
        const html = await loadHtml(baseUrl, maxRetries);

        if (html) {
            const $ = cheerio.load(html);

            // const forbiddenList = $('#list_forbidden .card_name')
            //     .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
            //     .get();

            // const limitedList = $('#list_limited .card_name')
            //     .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
            //     .get();

            // const semiLimitedList = $('#list_semi_limited .card_name')
            //     .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
            //     .get();
            let forbiddenList = [];
            const forbidden = $('#forbidden')
            forbidden.find('tbody tr').each((index, row) => {
                const secondTd = $(row).find('td:eq(1)'); // This selects the second <td> element in each row
                // Extract text content from the text node
                const textContent = secondTd.contents().first().text();
                
                forbiddenList.push(textContent);
            });
            console.log(forbiddenList, 'forbiddenList');

            // console.log('Forbidden List:');
            // console.log(forbiddenList);

            // console.log('Limited List:');
            // console.log(limitedList);

            // console.log('Semi-Limited List:');
            // console.log(semiLimitedList);

            // const data = {
            //     [forbiddenLimitedDate]: {
            //         forbiddenList,
            //         limitedList,
            //         semiLimitedList,
            //     },
            // };
    
            // console.log('Data to be appended:');
            // console.log(data);
    
            // appendToJsonFile(data);
        }
    } catch (error) {
        console.error('Error processing data:', error);
    }
}



// processFLData();
