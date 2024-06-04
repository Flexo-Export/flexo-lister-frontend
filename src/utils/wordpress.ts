import axios from 'axios';

const WP_URL = process.env.WP_URL;
const WP_USER = process.env.WP_USER;
const WP_PASS = process.env.WP_PASS;

export const postToWordpress = async (data: any) => {
  const response = await axios.post(
    `${WP_URL}/wp-json/wp/v2/posts`,
    data,
    {
      auth: {
        username: WP_USER!,
        password: WP_PASS!,
      },
    }
  );

  return response.data;
};

