# DC Check Deployment Guide

This guide explains how to deploy the DC Check application, including both the backend API server and the frontend web application.

## Prerequisites

- A Digital Ocean droplet running Ubuntu 20.04 or later
- Node.js 16+ and npm installed on the droplet
- Nginx installed on the droplet for serving the frontend and proxying API requests
- PM2 installed globally on the droplet for managing the Node.js process
- A Supabase account with a new project created
- Git installed on both your local machine and the droplet

## Setting Up the Project Repository

### 1. Create a GitHub Repository

1. Create a new repository on GitHub for your project
2. Initialize the repository locally:

```bash
# Initialize git in both directories
cd dc-check-api
git init
cd ../dc-check-frontend
git init
```

### 2. Create a Combined Repository Structure

You can organize your repository to include both frontend and backend:

```bash
mkdir dc-check
cd dc-check
mkdir api frontend
cp -r ../dc-check-api/* ./api/
cp -r ../dc-check-frontend/* ./frontend/
```

### 3. Create a .gitignore File in the Root Directory

```bash
# Root .gitignore
node_modules/
.env
.env.local
.DS_Store
dist/
build/
.cache/
logs/
*.log
```

### 4. Initialize and Push the Repository

```bash
git init
git add .
git commit -m "Initial commit with frontend and backend"
git remote add origin https://github.com/yourusername/dc-check.git
git push -u origin main
```

## Setting Up Supabase

### 1. Create a New Supabase Project

1. Go to [Supabase](https://supabase.io) and sign in
2. Create a new project with a name of your choice
3. Note down your Supabase URL and API key (from Project Settings > API)

### 2. Set Up the Database Schema

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy and paste the SQL schema from `supabase-schema.sql`
3. Run the SQL statements to create all the tables, indexes, and policies

## Deploying the Backend API

### 1. Connect to Your Droplet

```bash
ssh root@your-droplet-ip
```

### 2. Create a Directory for the API

```bash
mkdir -p /var/www/dc-check/api
cd /var/www/dc-check/api
```

### 3. Clone Your Repository

```bash
git clone https://github.com/yourusername/dc-check.git .
cd api
```

### 4. Install Dependencies and Set Up Environment Variables

```bash
npm install
```

Create an `.env` file:

```bash
nano .env
```

Add your configuration:

```
PORT=4000
NODE_ENV=production
JWT_SECRET=your_very_secure_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 5. Start the API Server with PM2

```bash
pm2 start src/server.js --name dc-check-api
pm2 save
pm2 startup
```

## Deploying the Frontend

### 1. Build the Frontend on Your Local Machine

First, update the environment variables in your frontend:

```bash
cd frontend
```

Create or update `.env.production`:

```
VITE_API_URL=https://yourdomain.com/api
```

Then build the frontend:

```bash
npm run build
```

### 2. Upload the Built Files to Your Droplet

You can use rsync to upload the files:

```bash
rsync -avzP dist/ root@your-droplet-ip:/var/www/dc-check/frontend/
```

Alternatively, you can build directly on the server:

```bash
# On your droplet
cd /var/www/dc-check/frontend
npm install
npm run build
```

## Configuring Nginx

### 1. Create an Nginx Configuration

```bash
nano /etc/nginx/sites-available/dc-check
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/dc-check/frontend;
    index index.html;

    # Frontend static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}
```

### 2. Enable the Site and Restart Nginx

```bash
ln -s /etc/nginx/sites-available/dc-check /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 3. Set Up SSL with Certbot (Optional but Recommended)

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

## Keeping Your Application Updated

### 1. Set Up a Script for Easy Updates

Create an update script in your droplet:

```bash
nano /var/www/dc-check/update.sh
```

Add the following content:

```bash
#!/bin/bash
set -e

# Update API
cd /var/www/dc-check/api
git pull
npm install
pm2 restart dc-check-api

# Update Frontend
cd /var/www/dc-check/frontend
git pull
npm install
npm run build

echo "Update completed successfully!"
```

Make the script executable:

```bash
chmod +x /var/www/dc-check/update.sh
```

### 2. Update Your Application

Whenever you want to update your application, push changes to GitHub and then run:

```bash
/var/www/dc-check/update.sh
```

## Monitoring and Maintenance

### 1. Monitor API Logs

```bash
pm2 logs dc-check-api
```

### 2. Check Nginx Logs

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 3. Restart Services if Needed

```bash
# Restart API
pm2 restart dc-check-api

# Restart Nginx
systemctl restart nginx
```

## Backup

It's recommended to set up regular backups of your Supabase database and your code repository.

### 1. Supabase Backups

Supabase automatically creates backups of your database. You can also export your data manually from the Supabase dashboard.

### 2. Code Backups

Your code is already backed up on GitHub, but you might want to download a local copy occasionally.

## Conclusion

Your DC Check application should now be successfully deployed and running on your Digital Ocean droplet. Users can access the application by navigating to your domain, and the API will be accessible at `/api`.

Remember to keep your systems updated with security patches and to monitor your application for any issues.
