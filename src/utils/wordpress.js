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
exports.postToWordpress = void 0;
const axios_1 = __importDefault(require("axios"));
const WP_URL = process.env.WP_URL;
const WP_USER = process.env.WP_USER;
const WP_PASS = process.env.WP_PASS;
const postToWordpress = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log('Data being sent to WordPress:', data); // Log the data being sent
        const response = yield axios_1.default.post(`${WP_URL}/wp-json/wp/v2/posts`, data, {
            auth: {
                username: WP_USER,
                password: WP_PASS,
            },
        });
        console.log('Response from WordPress:', response.data); // Log the response from WordPress
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Error response from WordPress:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data); // Log the error response from WordPress
        }
        else {
            console.error('An unknown error occurred:', error);
        }
        throw error;
    }
});
exports.postToWordpress = postToWordpress;
