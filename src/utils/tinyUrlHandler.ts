import axios from 'axios';

const TINYURL_API_KEY = process.env.TINYURL_API_KEY;

export const shortenUrl = async (url: string, alias: string) => {
    if (TINYURL_API_KEY) {
        const response = await axios.post(
            'https://api.tinyurl.com/create',
            {
                url,
                domain: 'tiny.one',  // You can choose the domain you prefer
                alias,  // Custom alias for the URL
            },
            {
                headers: {
                    'Authorization': `Bearer ${TINYURL_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.data.tiny_url;
    } else {
        const response = await axios.get(`http://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        return response.data;
    }
};
