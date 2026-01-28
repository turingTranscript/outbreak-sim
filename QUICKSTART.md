# 🚀 Quick Start (Copy & Paste)

## 30 seconds to running locally

```bash
# 1. Go to the folder
cd outbreak-simulator

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# Opens at http://localhost:3000
# You're done! 🎉
```

---

## 5 minutes to live on GitHub Pages

### Step 1: Initialize Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create GitHub repo
1. Go to [github.com/new](https://github.com/new)
2. Name it `outbreak-simulator`
3. Click "Create repository"

### Step 3: Connect & deploy
Replace `YOUR_USERNAME`:

```bash
git remote add origin https://github.com/YOUR_USERNAME/outbreak-simulator.git
git branch -M main
git push -u origin main
```

### Step 4: Update homepage in package.json
Find this line:
```json
"homepage": "https://YOUR_USERNAME.github.io/outbreak-simulator"
```

Then:
```bash
git add package.json
git commit -m "Update homepage"
git push
```

Wait ~2 minutes...

✨ **Your app is live at**: `https://YOUR_USERNAME.github.io/outbreak-simulator`

---

## 🐛 Why drug resistance is now working

**The Problem**: Original code never generated drug-resistant strains

**The Fix**: Added `drugResistanceMutationRate` parameter so resistance can actually evolve

**Try it**: Run the sim for 15-20 generations, red dots (drug-resistant) will appear and spread

---

## 📁 All files included:

- ✅ React component (fixed!)
- ✅ Configuration files
- ✅ Styling (Tailwind)
- ✅ Documentation
- ✅ GitHub Actions CI/CD
- ✅ Deployment guide

See `PACKAGE_CONTENTS.md` for complete file structure.

---

## Questions?

- **How to use**: See `README.md`
- **GitHub setup help**: See `GITHUB_SETUP.md`
- **Technical details**: See `TECHNICAL_DOCUMENTATION.md`

**That's it!** You have a complete, production-ready outbreak simulator. 🧬
