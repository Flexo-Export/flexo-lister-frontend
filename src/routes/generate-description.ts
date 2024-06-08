import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/generate-description', async (req, res) => {
  console.log('Request body:', req.body); // Log request body

  const { manufacturer, model, year, web_width, colors, die_stations } = req.body;

  const prompt = `Generate a detailed description for a used flexo press based on the following information:
    Manufacturer: ${manufacturer}
    Model: ${model}
    Year: ${year}
    Web Width: ${web_width}
    Colors: ${colors}
    Die Stations: ${die_stations}

    Find information about a ${year} ${manufacturer} ${model} with ${web_width}, ${colors}, and ${die_stations} online to create a ONE PARAGRAPH CONCICE listing description similar to this (In this example, 2016 Nilpeter FA4 is flexo press and it also lists press specific features) :
    2016 Nilpeter FA4 16in used flexo press featuring 40’OD unwind with roll lift, 8 flexo print stations motorized presetting for impression/360 reg., servo in-feed, direct servo gearless shaft for easy load printing sleeves, servo driven anilox drive for quick change anilox rolls, CLEANKING quick change chamber, full GEW UV Drying, chilling in all stations, hot air in final station, corona treater, film package, turnbar, mid feed (servo driven), gap-master system, slitting, waste suction, 2 rotary die stations, 40” waste tower, sheeting station, HD product rewind 40” OD, auto-registration, video inspection (integrated), gravure unit, 12 lightweight anilox rolls, and approx. 40 print sleeves.`
    ;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',  // Use GPT-4 model
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    console.log('OpenAI response:', response); // Log OpenAI response

    if (response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
      const description = response.choices[0].message.content.trim();
      res.json({ description });
    } else {
      console.error('No valid choices in response');
      res.status(500).json({ message: 'No valid choices returned by OpenAI' });
    }
  } catch (error) {
    console.error('Error generating description:', error); // Log error
    res.status(500).json({ message: 'Failed to generate description', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;

