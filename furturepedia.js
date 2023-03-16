const cheerio = require("cheerio");
const axios = require("axios");

const BASE_URL = `https://www.futurepedia.io`;

const fetchCategories = async function(){
    try {
        const axiosResponse = await axios.request({
            method: "GET",
            url:`${BASE_URL}/ai-tools`,
            headers:{
                "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
            }
        });
        const $ = cheerio.load(axiosResponse);
        const categories = [];
        const categoryCover = $(".MuiBox-root .css-10ib5jr");
        console.log(categoryCover);
        $(categoryCover).find(".MuiTypography-root").map((j,elem)=>{
            const text = elem.text();
            console.log(text);
            categories.push(text);
        });
    } catch (error) {
        console.log(error);
    }
}

fetchCategories();