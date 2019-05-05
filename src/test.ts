require("dotenv").config();
import { generatePagesSitemap, putSiteMapToGCP } from "./sitemaps";

async function test() {
  const name = "test-pages";
  const allPagesSiteMapUrls = await generatePagesSitemap(name);
  putSiteMapToGCP(name, allPagesSiteMapUrls);
}

test();
