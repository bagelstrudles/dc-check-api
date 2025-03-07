# DC Check Frontend

A React-based frontend application for tracking Pokemon card prices and managing inventory.

## Features

- User authentication and authorization
- Admin dashboard for price management
- Automated daily price updates from PriceCharting
- Price history tracking for different card conditions
- Role-based access control

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with:
```
VITE_API_URL=http://64.23.235.7:3000/api
```

3. Run development server:
```bash
npm run dev
```

## Automated Price Updates

The application includes automated price updates from PriceCharting. To set up:

1. Deploy cron job:
```bash
chmod +x scripts/deploy-cron.sh
./scripts/deploy-cron.sh
```

2. Monitor logs:
```bash
ssh root@64.23.235.7 "tail -f /var/log/price-updates.log"
```

## Deployment

The application is deployed using Vercel:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/utils` - Utility functions
  - `/api` - API integration
  - `/pages` - Page components
- `/scripts` - Automation scripts
  - `priceUpdate.js` - Price update script
  - `cronPriceUpdate.sh` - Cron job script
  - `deploy-cron.sh` - Deployment script

## Contributing

1. Create a feature branch
2. Make changes
3. Submit a pull request

## License

MIT
