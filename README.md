# RankAgent OS — AI SEO Automation & Implementation Platform
*Architect & Lead Engineer: Dheeraj Rawat Mohan*

RankAgent is an autonomous full-stack SEO operating system that connects to Google Search Console (GSC), Google Analytics 4 (GA4), and live website CMS platforms (WordPress, Shopify, Webhooks) to perform real technical audits, natural-language query intelligence, and 1-click fix implementations with instant rollback.

---

## 🚀 How to Deploy Live via GitHub (Step-by-Step)

Because this platform includes a live HTTP crawler backend and server-side Gemini 3.8 AI engine, it runs as a full-stack Node.js Express server. Here are the easiest and most reliable ways to take it live directly from your GitHub repository for free:

### Method 1: Deploy on Render.com (Recommended & Free)
1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: RankAgent OS by Dheeraj"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/rankagent-os.git
   git push -u origin main
   ```
2. Go to [Render.com](https://render.com) and log in with your GitHub account.
3. Click **"New +"** &rarr; Select **"Web Service"**.
4. Choose your `rankagent-os` repository from GitHub.
5. Set the following settings:
   - **Name:** `rankagent-os`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
6. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Gemini API key (from Google AI Studio)
   - `NODE_ENV`: `production`
7. Click **"Deploy Web Service"**!
Render will automatically build and give you a live URL (e.g. `https://rankagent-os.onrender.com`), and every time you `git push` to your GitHub repo, it will auto-deploy the changes live!

---

### Method 2: Deploy on Railway.app
1. Go to [Railway.app](https://railway.app) and sign in with GitHub.
2. Click **"New Project"** &rarr; **"Deploy from GitHub repo"**.
3. Select your repository.
4. Add the `GEMINI_API_KEY` variable under **Variables**.
5. Railway automatically detects Node.js, builds `dist`, runs `npm start`, and gives you a free live public domain.

---

### Method 3: Run Locally or on VPS
```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/rankagent-os.git
cd rankagent-os

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Or build and run production server
npm run build
npm start
```

---

## 🌟 Key Features
- **Real Live HTTP DOM Crawler**: Tested and validated on live websites with real TTFB latency, server headers, and DOM hierarchy.
- **Google Search Console & GA4 Integration**: Authenticated with `dheerajrawatmohan@gmail.com` for real keyword opportunity detection.
- **Human-Grade Executive Dossier**: Handcrafted consulting layout with editable consultant name, scope of work (SOW), and custom auditor notes.
- **Multi-Format Export**: 1-click export to **PDF**, **Excel (.csv)**, **Word (.doc)**, and **PowerPoint (.html slides)**.
- **Implementation & Rollback Hub**: Side-by-side diff preview, approval workflow, and 1-click undo.
