import axios from 'axios';

const WP_URL = process.env.WP_URL;
const WP_USER = process.env.WP_USER;
const WP_PASS = process.env.WP_PASS;

export const postToWordpress = async (data: any) => {
  try {
    console.log('Data being sent to WordPress:', data); // Log the data being sent

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

    console.log('Response from WordPress:', response.data); // Log the response from WordPress

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error response from WordPress:', error.response?.data); // Log the error response from WordPress
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};

