const puppeteer = require("puppeteer");
const { resultTemplate } = require("./templates");
let subjects = require("./data/subjects");
const fs = require("fs");

subjects = subjects.sort((a, b) => a.code.localeCompare(b.code));

const exportWebsiteAsPdf = async (html, outputPath) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.addScriptTag({
    url: "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js",
  });
  const bin = await page.evaluate(() => {
    var table = document.body.getElementsByTagName("table")[0];

    var wb = XLSX.utils.table_to_book(table);

    return XLSX.write(wb, { type: "binary", bookType: "xlsb" });
  });
  fs.writeFileSync("SheetJSPuppeteer.xlsb", bin, { encoding: "binary" });

  // await page.emulateMediaType("screen");
  // const PDF = await page.pdf({
  //   path: outputPath,
  //   printBackground: true,
  //   width: 1980,
  //   margin: {
  //     top: "50px",
  //     right: "100px",
  //     bottom: "50px",
  //     left: "100px",
  //   },
  // });
  await browser.close();
};

exportWebsiteAsPdf(
  resultTemplate({
    subjects,
    maxTotal: 800,
    totalColumnCount: 9 + 3 * subjects.length,
  }),
  "result.pdf"
);
