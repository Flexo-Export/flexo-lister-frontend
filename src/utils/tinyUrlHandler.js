"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortenUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const TINYURL_API_KEY = process.env.TINYURL_API_KEY;
const shortenUrl = (url, alias) => __awaiter(void 0, void 0, void 0, function* () {
    if (TINYURL_API_KEY) {
        const response = yield axios_1.default.post('https://api.tinyurl.com/create', {
            url,
            domain: 'tiny.one', // You can choose the domain you prefer
            alias, // Custom alias for the URL
        }, {
            headers: {
                'Authorization': `Bearer ${TINYURL_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.data.tiny_url;
    }
    else {
        const response = yield axios_1.default.get(`http://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        return response.data;
    }
});
exports.shortenUrl = shortenUrl;
