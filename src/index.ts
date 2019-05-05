require('@google-cloud/debug-agent');
import { generatePagesSitemap, putSiteMapToGCP } from "./sitemaps";

process.env.IN_GCP = 'true';

exports.updateSitemap = async (req, res) => {
  const name = "pages";
  const allPagesSiteMapUrls = await generatePagesSitemap(name);
  putSiteMapToGCP(name, allPagesSiteMapUrls, res);
};
