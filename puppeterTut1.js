const puppeteer = require('puppeteer');

async function getDetails(link="https://www.futurepedia.io/ai-tools"){
    try {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.goto(link);
        await page.waitForSelector('.MuiBox-root.css-10ib5jr');
        await page.waitForTimeout(2000); // Add a 1-second delay
        await page.waitForSelector(".MuiTypography-root.MuiTypography-body1.css-130n0lg");
        const data = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('.MuiBox-root.css-10ib5jr'));
            return cards.map(card => {
                const name = card.querySelector('.MuiTypography-root.MuiTypography-body1').textContent;
                return { name };
            });
        });

        await browser.close();
        return data;
    } catch (error) {
        console.log(error);
        return {status:400,message:"Something bad happened"};
    }
}

getDetails().then(console.log);
