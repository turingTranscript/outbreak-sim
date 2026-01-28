# Setup Instructions for GitHub

## Step 1: Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Outbreak Simulator"
```

## Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository called `outbreak-simulator`
3. **Do NOT** initialize with README (you already have one)

## Step 3: Connect Local to Remote

Replace `USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/USERNAME/outbreak-simulator.git
git branch -M main
git push -u origin main
```

## Step 4: Enable GitHub Pages

1. Go to your repository settings
2. Scroll to "GitHub Pages" section
3. Under "Source", select `gh-pages` branch (will appear after first deploy)
4. Your site will be available at `https://USERNAME.github.io/outbreak-simulator`

## Step 5: Update package.json homepage

Edit `package.json` and add/update this line in the root:

```json
"homepage": "https://USERNAME.github.io/outbreak-simulator"
```

Replace `USERNAME` with your GitHub username.

## Step 6: Deploy

Option A - Automatic (via GitHub Actions):
```bash
git add package.json
git commit -m "Update homepage URL"
git push
```
The workflow in `.github/workflows/deploy.yml` will automatically deploy when you push to main.

Option B - Manual:
```bash
npm run build
npm run deploy
```
(Requires `gh-pages` package installed)

## View Your Site

After deployment, visit: `https://USERNAME.github.io/outbreak-simulator`

## Troubleshooting

**Build fails**: Make sure `homepage` in `package.json` matches your GitHub Pages URL

**Changes not showing**: GitHub Pages can take a few minutes to update. Try hard refresh (Ctrl+Shift+R)

**Want to update the app**: Just push to the main branch and GitHub Actions will rebuild automatically!

```bash
git add .
git commit -m "Your changes"
git push
```
