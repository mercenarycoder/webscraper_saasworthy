const cheerio = require("cheerio");
const axios = require("axios");

const BASE_URL = "https://www.saasworthy.com";
async function getAllScraps() {
  try {
    const axiosResponse = await axios.request({
      method: "GET",
      url: `${BASE_URL}/list`,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(axiosResponse.data);
    const allcatgry_wrp = $(".allcatgry_wrp");
    const nextLinks = [];
    $(allcatgry_wrp)
      .find(".catgry_div a")
      .map((j, elem) => {
        const link = $(elem).attr("href");
        const text = $(elem).text().trim();
        nextLinks.push({ link: `${BASE_URL}${link}`, text });
        return link;
      });
    // console.log(nextLinks);
    return { status: 200, links: nextLinks };
  } catch (error) {
    console.log(error);
    return { status: 420, message: "Something went wrong" };
  }
}

async function getDetailOverview(
  link = "https://www.saasworthy.com/product/postman"
) {
  try {
    const axiosResponse = await axios.request({
      method: "GET",
      url: `${link}`,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
        cookie:
          "_gcl_au=1.1.1463669841.1678532510; _fbp=fb.1.1678532511065.1410501840; _jsuid=3216506683; _referrer_og=https://www.google.com/; __gads=ID=7a8e659ff71ed7f7-2297ef0ff5db0056:T=1678532511:S=ALNI_MYSdWYvmeSaXj0Q78ojsEA9FGZrmg; actionShortlist=; actionUseThis=; actionWriteReview=; actionLikeAnswer=; actionSpam=; actionPostQuestion=; actionPostComment=; actionPostReply=; actionDownloadDoc=; _gid=GA1.2.107946917.1678782007; ln_or=eyI2MjUzNzEiOiJkIn0=; swUid=3a542b1c3b2e74140886129947158465; GCLB=COXWx-HAoe7btQE; __gpi=UID=00000bd77657771b:T=1678532511:RT=1678856759:S=ALNI_MYs2vfED3P7YVro6p-yLRaPYmwBjA; compareCount=0; compareIds=; compareNames=; compareUrl=https://www.saasworthy.com/compare/?pIds=; PHPSESSID=tsdem8kc5su223p82s0o9op372; _ga_PEJE9VEKFH=GS1.1.1678856744.9.1.1678858125.0.0.0; _ga=GA1.2.1444322601.1678532511; _uetsid=eb8db420c25311edaa28c5c904c17822; _uetvid=280452b0c00611edb37c5db58db1357c",
      },
    });
    const deepscrap = {};
    const $ = cheerio.load(axiosResponse.data);
    //    Features fetching from here
    const feture_list = $(".feture_list");
    const productFeatures = [];
    $(feture_list)
      .find("li")
      .map((i, elem) => {
        let feature = $(elem).find("a").text();
        if (feature.length === 0) {
          feature = $(elem)?.text();
        }
        const description = $(elem).find("span.tooltip-desc").text();
        productFeatures.push({
          feature,
          description,
        });
      });
    deepscrap["Features"] = productFeatures;
    // console.log(productFeatures);
    //technical Details from here
    const rootTable = $(".container.detail-box");
    const support = $(rootTable)
      .find('td:contains("Support")')
      .next()
      .text()
      .trim();
    const api =
      $(rootTable).find('td:contains("API")').next().find("i.fa-check-circle-o")
        .length > 0;
    const deployment = $(rootTable)
      .find('td:contains("Deployment")')
      .next()
      .find("span")
      .map((i, el) => $(el).text())
      .get();
    const location = $(rootTable)
      .find('td:contains("Location")')
      .next()
      .text()
      .trim();
    const website = $(rootTable)
      .find('td:contains("Official Website")')
      .next()
      .find("a")
      .attr("href");
    const category = $(rootTable)
      .find('td:contains("Category")')
      .next()
      .find("a")
      .text();

    // console.log(support); // Output: 24/7 (Live rep) Business Hours Online
    // console.log(api); // Output: true
    // console.log(deployment); // Output: [ 'SaaS/Web/Cloud', 'Mobile - Android', 'Installed - Windows', 'Installed - Mac' ]
    // console.log(location); // Output: San Francisco, California / +1 415-796-6470
    // console.log(website); // Output: https://www.postman.com/
    // console.log(category); // Output: API Management Software
    deepscrap["category"] = category;
    deepscrap["website"] = website;
    deepscrap["location"] = location;
    deepscrap["deployment"] = deployment;
    deepscrap["api"] = api;
    deepscrap["support"] = support.trim().split("\n");
    // Integrations from here
    const integrations = [];
    const items = $(".item_story_card");

    // Loop through each item and extract the data
    items.each((index, element) => {
      const rating = $(element).find(".pop_score").text().trim();
      const name = $(element).find(".stry_blu_titl a").text().trim();
      const description = $(element).find(".stry_review").text().trim();
      const imageUrl = $(element).find("img").attr("src");

    //   console.log(`Rating: ${rating}`);
    //   console.log(`Name: ${name}`);
    //   console.log(`Description: ${description}`);
    //   console.log(`Image URL: ${imageUrl}`);
      integrations.push({name,description,imageUrl,rating});
    });
    deepscrap["integrations"] = integrations;
    console.log(deepscrap);
    return deepscrap;
  } catch (error) {
    console.log(error);
    return new Error({ status: 400, message: "Something did not add up" });
  }
}

//https://www.saasworthy.com/list/analytics-platforms?page=2
async function getDetails(
  link = "https://www.saasworthy.com/list/analytics-platforms",
  i = 1,
  result = []
) {
  try {
    console.log(i);
    const axiosResponse = await axios.request({
      method: "GET",
      url: `${link}`,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
        cookie:
          "_gcl_au=1.1.1463669841.1678532510; _fbp=fb.1.1678532511065.1410501840; _jsuid=3216506683; _referrer_og=https://www.google.com/; __gads=ID=7a8e659ff71ed7f7-2297ef0ff5db0056:T=1678532511:S=ALNI_MYSdWYvmeSaXj0Q78ojsEA9FGZrmg; actionShortlist=; actionUseThis=; actionWriteReview=; actionLikeAnswer=; actionSpam=; actionPostQuestion=; actionPostComment=; actionPostReply=; actionDownloadDoc=; _gid=GA1.2.107946917.1678782007; ln_or=eyI2MjUzNzEiOiJkIn0=; swUid=3a542b1c3b2e74140886129947158465; GCLB=COXWx-HAoe7btQE; __gpi=UID=00000bd77657771b:T=1678532511:RT=1678856759:S=ALNI_MYs2vfED3P7YVro6p-yLRaPYmwBjA; compareCount=0; compareIds=; compareNames=; compareUrl=https://www.saasworthy.com/compare/?pIds=; PHPSESSID=tsdem8kc5su223p82s0o9op372; _ga_PEJE9VEKFH=GS1.1.1678856744.9.1.1678858125.0.0.0; _ga=GA1.2.1444322601.1678532511; _uetsid=eb8db420c25311edaa28c5c904c17822; _uetvid=280452b0c00611edb37c5db58db1357c",
      },
    });
    const $ = cheerio.load(axiosResponse.data);
    const totalResults = $(".prdct_nmbr b #totallistCount").text();
    console.log(totalResults);
    const rightPanel = $("div.right-pnl.right");
    // console.log(rightPanel);
    const softwares = [];
    $(rightPanel)
      .find("div.fndr-row.saas_list")
      .map(async (j, elem) => {
        // console.log(elem)
        const productName = $(elem)
          .find("div.no-score-spons a.fndr-title")
          ?.attr("title");
        const productUrl = $(elem)
          .find("div.no-score-spons a.fndr-title")
          ?.attr("href");
        const productDescription = $(elem)
          .find("p.pro-desc-partial span")
          ?.text();
        const ratingsCount = $(elem).find("span.rat-count").text().trim();
        const starRating = $(elem)
          .find("span.rating_filled")
          .attr("style")
          ?.split(":")[1]
          ?.trim();
        const productLink = $(elem).find(" a.compareText");
        const productDetail = $(productLink[0]).attr("href").trim();
        // console.log(`${productName} \n ${productDescription} \n ${productUrl} \n ${ratingsCount}`);
        let detailedProduct = {}
        if (productDetail.includes("/product/")) {
          console.log(productDetail);
          detailedProduct = await getDetailOverview(
            `${BASE_URL}${productDetail}`
          );
        }
        const resultObj = {
          productName,
          productDescription,
          productUrl,
          ratingsCount,
          starRating,
          detailedProduct
        };
        softwares.push(resultObj);
      });
    // console.log(softwares);
    result.push(...softwares);
    console.log(totalResults - 20 > 1);
    if (totalResults > i * 20) {
      i++;
      return getDetails(`${link}?page${i}`, i, result);
    }
    return result;
  } catch (error) {
    console.log(error);
    return { status: 400, message: "Something bad happened" };
  }
}

async function getDetailCategorySoftware() {
  try {
    const results = await getAllScraps();
    if (results.status != 200) {
      const err = new Error("Something went wrong");
      throw err;
    }
    const { links } = results;
    for (let i = 0; i < links.length; i++) {
      console.log("coming here");
      const detailCrawling = await getDetails(links[i].link, 1);
      results.links[i].details = detailCrawling;
    }
    // console.log(results);
  } catch (error) {
    console.log(error);
  }
}
// getDetailCategorySoftware();
// const res = getDetails().then((res) => {
//   console.log(new Set(res));
// });
// getAllScraps();
getDetailOverview();
