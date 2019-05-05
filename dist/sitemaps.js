"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sitemap_1 = __importDefault(require("sitemap"));
var path_1 = __importDefault(require("path"));
var storage_1 = require("@google-cloud/storage");
var stream_1 = require("stream");
function getAllWebPages() {
    return __awaiter(this, void 0, void 0, function () {
        var urls;
        return __generator(this, function (_a) {
            urls = [
                { url: "https://w3js.com/" },
                {
                    url: "https://w3js.com/article/what-aws-lambda-users-should-know-about-azure-functions-and-vice-versa/1103"
                }
            ];
            return [2 /*return*/, new Promise(function (res) {
                    setTimeout(function () { return res(urls); }, 1000);
                })];
        });
    });
}
function generateSitemapXML(fileName, urls) {
    var sitemap = sitemap_1.default
        .createSitemap({
        hostname: "http://w3js.com",
        cacheTime: 600000,
        urls: urls
    })
        .toString();
    return sitemap;
}
function generatePagesSitemap(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var allPages, allPagesSiteMapUrls, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getAllWebPages()];
                case 1:
                    allPages = _a.sent();
                    console.log("Fetched " + allPages.length + " of pages for " + fileName + ".xml");
                    allPagesSiteMapUrls = generateSitemapXML(fileName, allPages);
                    return [2 /*return*/, allPagesSiteMapUrls];
                case 2:
                    err_1 = _a.sent();
                    console.log("Fail to fetch pages for " + fileName + ".xml", err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.generatePagesSitemap = generatePagesSitemap;
function putSiteMapToGCP(fileName, sitemap, res) {
    var storage;
    var isInGCP = process.env.IN_GCP === "true";
    if (!isInGCP) {
        storage = new storage_1.Storage({
            projectId: process.env.PROJECT_ID,
            keyFilename: path_1.default.join(__dirname, "../credentials.json")
        });
    }
    else {
        storage = storage = new storage_1.Storage();
    }
    var bucket = storage.bucket(process.env.BUCKET_NAME);
    var rs = new stream_1.Readable();
    rs._read = function () {
        rs.push(sitemap);
        rs.push(null);
    };
    var file = bucket.file(fileName + ".xml");
    var writeStream = file.createWriteStream();
    rs.pipe(writeStream)
        .on("error", function (error) {
        console.log("Error putting sitemap to GCP:", error);
        if (isInGCP) {
            res.send("Error putting sitemap to GCP:", error);
        }
    })
        .on("finish", function () {
        console.log("Successfully put sitemap to GCP for " + fileName);
        if (isInGCP) {
            res.send("Successfully put sitemap to GCP for " + fileName);
        }
    });
}
exports.putSiteMapToGCP = putSiteMapToGCP;
