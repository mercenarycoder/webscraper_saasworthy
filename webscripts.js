const cheerio = require('cheerio');

async function scarper(){
    const $ = cheerio.load(`
    <ul>
      <li>One</li>
      <li>Two</li>
      <li class="blue sel">Three</li>
      <li class="red">Four</li>
    </ul>
`);
// Extract the text content of the first .red element
const data = $('.red').first().text();
console.log(data);
}

scarper();
