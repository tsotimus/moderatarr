# Moderatarr

Moderatarr is a lightweight TypeScript webhook server that listens to incoming requests from Overseerr and provides intelligent anime detection and automation.

## Features

- 🎌 **Better Anime Detection** - Advanced anime detection using TMDB data
- 📁 **Automatic Configuration** - Root folder and quality profile changes when anime is detected
- 📧 **Email Notifications** - Automatic email notifications to users via Resend
- 👥 **Contact Management** - Automatic contact addition to Resend
- 🐳 **Docker Ready** - Easy deployment with Docker

## Quick Start

### Step 1: Pull the Docker Image

```bash
docker pull tsotimus1/moderatarr:latest
```

### Step 2: Run the Container

```bash
docker run -d \
  --name moderatarr \
  -p 3000:3000 \
  -v moderatarr_data:/app/data \
  -e RESEND_API_KEY=your_resend_api_key \
  -e RESEND_AUDIENCE_ID=your_resend_audience_id \
  -e TMDB_API_TOKEN=your_tmdb_api_token \
  -e OVERSEERR_API_TOKEN=your_overseerr_api_token \
  -e OVERSEERR_BASE_URL=http://your-overseerr:5055 \
  -e OVERSEERR_EMAIL=your_overseerr@email.com \
  -e ADMIN_EMAIL=your_admin@email.com \
  -e OVERSEERR_EMAIL_URL=http://your-overseerr:5055 \
  --restart unless-stopped \
  tsotimus1/moderatarr:latest
```

### Step 3: Verify it's Running

```bash
# Check if container is running
docker ps | grep moderatarr

# Check application health
curl http://localhost:3000/health
```

### Step 4: Setup Webhook in Overseerr

1. In Overseerr, go to **Settings** → **Notifications** → **Webhook**
2. Set the webhook URL to: `http://your-server-ip:3000/webhook/overseerr`
3. Enable the webhook for **"Media Pending"** notifications
4. Save the configuration

That's it! Your Moderatarr instance is now running and ready to process anime requests.

## Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | Your Resend API key | `re_123456789` |
| `RESEND_AUDIENCE_ID` | Your Resend audience ID | `aud_123456789` |
| `TMDB_API_TOKEN` | The Movie Database API token | `eyJhbGciOiJIUzI1NiJ9...` |
| `OVERSEERR_API_TOKEN` | Your Overseerr API token | `MTcxNjQ4NzE4NXxZV...` |
| `OVERSEERR_BASE_URL` | Your Overseerr base URL | `http://overseerr:5055` |
| `OVERSEERR_EMAIL` | Overseerr notification email | `overseerr@yourdomain.com` |
| `ADMIN_EMAIL` | Admin email for alerts | `admin@yourdomain.com` |
| `OVERSEERR_EMAIL_URL` | Overseerr email URL | `http://overseerr:5055` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MAX_NON_ANIME_SEASONS` | Max seasons for non-anime shows | `2` |
| `MAX_ANIME_SEASONS` | Max seasons for anime shows | `2` |
| `DEFAULT_TO_LATEST` | Default to latest season | `true` |
| `DB_FILE_NAME` | Database file path | `moderatarr.db` |
