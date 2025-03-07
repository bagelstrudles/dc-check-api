import axios from 'axios';
import csv from 'csv-parser';
import fs from 'fs';
import { pipeline } from 'stream/promises';

const PRICE_CHARTING_URL = 'https://www.pricecharting.com/price-guide/download-custom?t=1dd54e0b39cef870097d65eee194d89d4b347058&category=pokemon-cards';
const API_URL = process.env.VITE_API_URL || 'http://64.23.235.7:3000/api';

const downloadCSV = async () => {
  const response = await axios({
    url: PRICE_CHARTING_URL,
    method: 'GET',
    responseType: 'stream'
  });

  const writer = fs.createWriteStream('./latest_prices.csv');
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const processCSV = async () => {
  const results = [];
  const readStream = fs.createReadStream('./latest_prices.csv');
  
  await pipeline(
    readStream,
    csv(),
    async function* (source) {
      for await (const record of source) {
        // Only process Pokemon cards
        if (record.genre?.toLowerCase().includes('pokemon')) {
          const priceData = {
            pricecharting_id: record.id,
            product_name: record.product_name,
            asin: record.asin,
            epid: record.epid,
            upc: record.upc,
            prices: {
              // BGS prices
              bgs_10: parseFloat(record['bgs-10-price']) || null,
              bgs_95: parseFloat(record['box-only-price']) || null,
              bgs_7: parseFloat(record['cib-price']) || null,
              
              // CGC prices
              cgc_10: parseFloat(record['condition-17-price']) || null,
              
              // SGC prices
              sgc_10: parseFloat(record['condition-18-price']) || null,
              
              // Other graded prices
              graded_9: parseFloat(record['graded-price']) || null,
              graded_8: parseFloat(record['new-price']) || null,
              
              // Ungraded price
              ungraded: parseFloat(record['loose-price']) || null,
              
              // PSA prices
              psa_10: parseFloat(record['manual-only-price']) || null,
              
              // Additional metadata
              console_name: record['console-name'],
              genre: record.genre,
              release_date: record['release-date'],
              sales_volume: parseInt(record['sales-volume']) || null
            },
            timestamp: new Date().toISOString()
          };
          results.push(priceData);
        }
      }
      yield results;
    }
  );

  return results;
};

const updatePrices = async (prices) => {
  try {
    const token = process.env.ADMIN_TOKEN;
    if (!token) {
      throw new Error('ADMIN_TOKEN environment variable is not set');
    }

    const response = await axios.post(`${API_URL}/prices/bulk`, prices, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating prices:', error.message);
    throw error;
  }
};

const main = async () => {
  try {
    console.log('Downloading latest prices...');
    await downloadCSV();
    
    console.log('Processing CSV...');
    const prices = await processCSV();
    
    console.log(`Found ${prices.length} Pokemon cards to update`);
    await updatePrices(prices);
    
    console.log('Price update completed successfully');
    
    // Cleanup
    fs.unlinkSync('./latest_prices.csv');
  } catch (error) {
    console.error('Error in price update process:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
} 