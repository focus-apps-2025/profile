# FOCUS Engineering Portfolio Platform — VPS Deployment Runbook

Complete, production-tested guide for deploying the **FOCUS Engineering Multi-User Portfolio Platform** on an Ubuntu VPS (Ubuntu 22.04 LTS / 24.04 LTS).

---

## Architecture Overview

```
                      Internet
                         │
                 ┌───────▼───────┐
                 │ Nginx (Port   │
                 │ 80 / 443 SSL) │
                 └───┬───────┬───┘
                     │       │
       /api/*, /health       │ /* (SPA Fallback)
                     │       │
        ┌────────────▼───┐ ┌─▼──────────────┐
        │ Express API    │ │ Built React    │
        │ PM2 (Port 5000)│ │ /client/dist   │
        └────────────┬───┘ └────────────────┘
                     │
              ┌──────▼──────┐
              │   MongoDB   │
              │ (Port 27017)│
              └─────────────┘
```

---

## 1. System Requirements & Provisioning

### 1.1 Update Base System
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw build-essential
```

### 1.2 Install Node.js 20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # Verify: v20.x or higher
npm -v    # Verify: 10.x or higher
```

### 1.3 Install PM2 Globally
```bash
sudo npm install -g pm2
```

### 1.4 Install MongoDB Community Edition
```bash
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

### 1.5 Install Nginx & Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo systemctl enable nginx
```

### 1.6 Configure Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

---

## 2. Codebase Setup & Deployment

### 2.1 Clone Repository
```bash
sudo mkdir -p /var/www/focus-portfolio
sudo chown -R $USER:$USER /var/www/focus-portfolio
cd /var/www/focus-portfolio

git clone <YOUR_GIT_REPOSITORY_URL> .
```

### 2.2 Configure Server Environment Variables
Create `/var/www/focus-portfolio/server/.env`:
```bash
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://127.0.0.1:27017/focus_portfolios
JWT_SECRET=production_strong_jwt_secret_focus_2026_change_me!
JWT_EXPIRES_IN=7d
COOKIE_NAME=focus_admin_token
COOKIE_SECURE=true
CLIENT_URL=https://portfolio.focusengineeringapp.com
CANONICAL_SITE_URL=https://portfolio.focusengineeringapp.com
INITIAL_ADMIN_EMAIL=admin@focusengineering.com
INITIAL_ADMIN_PASSWORD=AdminSecure2026!
INITIAL_ADMIN_NAME=FOCUS System Administrator
```

### 2.3 Install Dependencies & Build Backend
```bash
cd /var/www/focus-portfolio/server
npm ci
npm run build

# Run database seed (creates initial admin & sample DJ/Manoj portfolios)
npm run seed
```

### 2.4 Build Frontend Application
```bash
cd /var/www/focus-portfolio/client
npm ci
npm run build
# Built files are in /var/www/focus-portfolio/client/dist
```

---

## 3. PM2 Process Management

Start backend cluster using the provided `ecosystem.config.js`:
```bash
cd /var/www/focus-portfolio
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd
```

Check backend status:
```bash
pm2 status
pm2 logs focus-portfolio-backend
curl http://localhost:5000/health
```

---

## 4. Nginx & SSL Configuration

### 4.1 Copy Nginx Virtual Host
```bash
sudo cp /var/www/focus-portfolio/docs/nginx-portfolio.conf /etc/nginx/sites-available/focus-portfolio
sudo ln -s /etc/nginx/sites-available/focus-portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

### 4.2 Obtain SSL Certificate with Certbot
```bash
sudo certbot --nginx -d portfolio.focusengineeringapp.com
```

### 4.3 Test & Reload Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Verification Checklist

1. **Root URL**: `https://portfolio.focusengineeringapp.com/` displays the FOCUS Engineering landing page and talent directory.
2. **Dynamic Slugs**:
   - `https://portfolio.focusengineeringapp.com/manoj` displays Manoj Kumar's Classic Corporate profile.
   - `https://portfolio.focusengineeringapp.com/dj` displays DJ's Modern Professional profile.
3. **Direct Page Refresh**: Navigating directly to `/dj` or `/manoj` returns the frontend SPA properly without 404 errors (verified via `try_files $uri $uri/ /index.html;`).
4. **API Routing**: `https://portfolio.focusengineeringapp.com/api/v1/health` returns `{ "status": "healthy" }`.
5. **Admin Portal**: `https://portfolio.focusengineeringapp.com/admin/login` allows secure login with `admin@focusengineering.com`.

---

## 6. Maintenance & Backups

### Database Backup Script (`/usr/local/bin/backup-portfolios.sh`):
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"
mongodump --db focus_portfolios --out "$BACKUP_DIR/focus_portfolios_$TIMESTAMP"
# Retain last 7 days
find "$BACKUP_DIR" -type d -mtime +7 -exec rm -rf {} +
```
Make executable: `chmod +x /usr/local/bin/backup-portfolios.sh`.
Schedule via cron (`crontab -e`):
```cron
0 2 * * * /usr/local/bin/backup-portfolios.sh >/dev/null 2>&1
```
