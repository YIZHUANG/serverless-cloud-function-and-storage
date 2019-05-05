import sm from "sitemap";
import path from "path";
import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";

type urls = {
  [key: string]: string;
};
async function getAllWebPages(): Promise<urls[]> {
  const urls = [
    { url: "https://w3js.com/" },
    {
      url:
        "https://w3js.com/article/what-aws-lambda-users-should-know-about-azure-functions-and-vice-versa/1103"
    }
  ];
  return new Promise(res => {
    setTimeout(() => res(urls), 1000);
  });
}
function generateSitemapXML(fileName: string, urls: urls[]): string {
  const sitemap = sm
    .createSitemap({
      hostname: "http://w3js.com",
      cacheTime: 600000,
      urls
    })
    .toString();
  return sitemap;
}
async function generatePagesSitemap(fileName: string): Promise<string> {
  try {
    const allPages = await getAllWebPages();
    console.log(`Fetched ${allPages.length} of pages for ${fileName}.xml`);
    const allPagesSiteMapUrls = generateSitemapXML(fileName, allPages);
    return allPagesSiteMapUrls;
  } catch (err) {
    console.log(`Fail to fetch pages for ${fileName}.xml`, err);
  }
}

function putSiteMapToGCP(fileName: string, sitemap: string, res?: any): void {
  let storage;
  const isInGCP = process.env.IN_GCP === "true";
  if (!isInGCP) {
    storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: path.join(__dirname, "../credentials.json")
    });
  } else {
    storage = storage = new Storage();
  }
  const bucket = storage.bucket(process.env.BUCKET_NAME);
  const rs = new Readable();
  rs._read = () => {
    rs.push(sitemap);
    rs.push(null);
  };
  const file = bucket.file(`${fileName}.xml`);
  const writeStream = file.createWriteStream();
  rs.pipe(writeStream)
    .on("error", error => {
      console.log("Error putting sitemap to GCP:", error);
      if (isInGCP) {
        res.send("Error putting sitemap to GCP:", error);
      }
    })
    .on("finish", () => {
      console.log(`Successfully put sitemap to GCP for ${fileName}`);
      if (isInGCP) {
        res.send(`Successfully put sitemap to GCP for ${fileName}`);
      }
    });
}

export { generatePagesSitemap, putSiteMapToGCP };
