//https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?forbiddenLimitedDate=2012-03-01
//^ to Fetch the forbidden/limited list - it is sorted from 2012 until present
//Add in my card objects for the cards.name if it matches with the one of the forbidden/limited list
//a new key:value pair that will list whether a card is limited/semi limited/forbidden for that period
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import cheerio from 'cheerio';

const __dirname = path.resolve(path.dirname(''));

const baseUrl = 'https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?forbiddenLimitedDate=';
const forbiddenLimitedDate = '2012-03-01';
let fileUrls = [];

const outputFilePath = path.join(__dirname, 'data', 'forbidden_limited_list.json');

const delayBetweenRequests = 6000; // 6 seconds
const maxRetries = 1;
const retryDelay = 1000;

if (fs.existsSync(outputFilePath)) {
  const existingData = fs.readFileSync(outputFilePath, 'utf8');
  // Assuming FORBIDDEN_LIMITED_LIST is an array
  const existingList = JSON.parse(existingData);
  // Append existing data to FORBIDDEN_LIMITED_LIST
  FORBIDDEN_LIMITED_LIST.push(...existingList);
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

async function processFLData() {
    try {
        const html = await loadHtml(baseUrl + forbiddenLimitedDate, maxRetries);

        if (html) {
            const $ = cheerio.load(html);

            const forbiddenList = $('#list_forbidden .card_name')
                .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
                .get();

            const limitedList = $('#list_limited .card_name')
                .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
                .get();

            const semiLimitedList = $('#list_semi_limited .card_name')
                .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
                .get();

            console.log('Forbidden List:');
            console.log(forbiddenList);

            console.log('Limited List:');
            console.log(limitedList);

            console.log('Semi-Limited List:');
            console.log(semiLimitedList);
        }
    } catch (error) {
        console.error('Error processing data:', error);
    }
}



processFLData();
