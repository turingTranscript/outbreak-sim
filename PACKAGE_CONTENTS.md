# Outbreak Simulator - Complete Package

## What's Included

This is a complete, production-ready React application for simulating pathogen outbreak dynamics.

### Project Structure

```
outbreak-simulator/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions CI/CD pipeline
├── public/
│   └── index.html               # HTML template
├── src/
│   ├── components/
│   │   └── OutbreakSimulator.jsx # Main simulation component (FIXED!)
│   ├── App.jsx                  # App wrapper
│   ├── index.js                 # React entry point
│   └── index.css                # Tailwind imports + global styles
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # Tailwind CSS processing
├── tailwind.config.js           # Tailwind configuration
├── README.md                    # Main documentation
├── GITHUB_SETUP.md              # Step-by-step GitHub deployment guide
└── TECHNICAL_DOCUMENTATION.md   # Detailed bug fix explanation
```

## Quick Start (5 minutes)

### 1. Setup

```bash
# Clone the repository (or download these files)
cd outbreak-simulator
npm install
```

### 2. Run Locally

```bash
npm start
```

Opens at `http://localhost:3000`

### 3. Deploy to GitHub Pages

```bash
# Option 1: Use GitHub Actions (automatic)
# Just push to main branch and it deploys automatically!

# Option 2: Manual deployment
npm install --save-dev gh-pages

# Update package.json homepage:
# "homepage": "https://YOUR_USERNAME.github.io/outbreak-simulator"

npm run deploy
```

See `GITHUB_SETUP.md` for detailed instructions.

## What Was Fixed

### The Bug
Drug resistance wasn't appearing in the simulation because:
- Drug resistance mutations were never being generated
- Only generic "MUT" type mutations were created
- Drug selection logic couldn't find any resistant individuals

### The Fix
- Added explicit `drugResistanceMutationRate` parameter (0.01 = 1% per generation)
- Separate mutation pathway specifically creates `drug_resistance` mutation
- Drug selection now triggers when resistant strains exist
- Red dots now properly show drug-resistant individuals

**See `TECHNICAL_DOCUMENTATION.md` for detailed explanation**

## How to Use the Simulator

### Controls
- **Play/Pause**: Run continuous simulation or stop
- **Step**: Advance one generation manually
- **Reset**: Restart with new population
- **Advanced Parameters**: Tweak all variables in real-time

### Key Parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| `hostCount` | 3 | Number of separate host populations |
| `populationPerHost` | 100 | Individuals per host |
| `mutationRate` | 0.05 | Generic mutation probability |
| `drugResistanceMutationRate` | 0.01 | Drug resistance appearance rate (1%) |
| `transmissionRate` | 0.4 | Probability of transmission between hosts |
| `bottleneckSize` | 10 | Number of individuals transmitted |
| `drugPressure` | 0.7 | Strength of drug selection |
| `driftStrength` | 0.1 | Genetic drift magnitude |
| `recombinationRate` | 0.02 | Sexual recombination probability |
| `migrationRate` | 0.05 | Between-host migration rate |

### Visualization
- **Blue dots**: Wild-type (no mutations)
- **Red dots**: Drug-resistant strains ✨ (NOW WORKING!)
- **Amber dots**: Other mutants

## Experiments to Try

### 1. Watch Drug Resistance Spread
```
Default settings, just hit Play
→ Red dots appear after ~10-20 generations
→ Red dominates population as drug eliminates blue
```

### 2. Effect of Transmission Bottleneck
```
Set bottleneckSize to 1 (tight bottleneck)
→ Less genetic diversity spreads between hosts
→ Resistant strains may get stuck in bottleneck

Set bottleneckSize to 50 (loose bottleneck)
→ More diversity spreads
→ Resistance spreads faster to other hosts
```

### 3. Genetic Drift Impact
```
Set driftStrength to 0.5 (strong drift)
→ Random fluctuations dominate
→ Less predictable outcomes

Set driftStrength to 0.01 (weak drift)
→ Selection effects more obvious
→ Red steadily increases
```

### 4. Recombination Benefits
```
Enable recombination, set recombinationRate to 0.1
→ Mutations can combine from two parents
→ Faster adaptation possible

Disable recombination
→ Each mutation comes from independent events
→ Slower optimization
```

## Technology Stack

- **React 18**: Modern UI framework with hooks
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Create React App**: Build tooling

## Deployment Options

### Option 1: GitHub Pages (Free)
```bash
npm run deploy
# Available at: https://username.github.io/outbreak-simulator
```

### Option 2: Vercel (Free)
1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Automatic deployment on each push

### Option 3: Netlify (Free)
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `build`
4. Done!

### Option 4: Traditional Server
```bash
npm run build
# Upload the 'build' folder to any static hosting
```

## File Descriptions

### Core App Files
- `src/App.jsx` - Main app component, imports simulator
- `src/index.js` - React entry point, renders app
- `src/index.css` - Global styles and Tailwind directives
- `public/index.html` - HTML template for the app

### Simulation Logic
- `src/components/OutbreakSimulator.jsx` - **All simulation logic lives here!**
  - 6 evolutionary processes per generation
  - Real-time statistics
  - Interactive parameter controls

### Configuration
- `package.json` - Dependencies: React, Tailwind, Lucide, etc.
- `tailwind.config.js` - Tailwind theme customization
- `postcss.config.js` - CSS processing pipeline
- `.gitignore` - What to exclude from version control

### Documentation
- `README.md` - User guide and feature documentation
- `GITHUB_SETUP.md` - Step-by-step GitHub deployment
- `TECHNICAL_DOCUMENTATION.md` - Deep dive into bug fix
- `PACKAGE_CONTENTS.md` - This file!

### CI/CD
- `.github/workflows/deploy.yml` - Automatic GitHub Pages deployment

## Common Issues & Fixes

### "npm: command not found"
→ Install Node.js from nodejs.org

### "Port 3000 already in use"
```bash
npm start -- --port 3001
```

### Drug resistance still not showing?
1. Make sure you're using the FIXED version (`src/components/OutbreakSimulator.jsx`)
2. Increase `drugResistanceMutationRate` to 0.05
3. Run for at least 20 generations before expecting red dots

### GitHub Pages shows blank page?
1. Check that `homepage` in `package.json` matches your GitHub Pages URL
2. Hard refresh the page (Ctrl+Shift+R)
3. Wait 5 minutes for GitHub Pages to rebuild

## Want to Modify?

The code is well-commented and organized:

1. **Change simulation logic**: Edit `src/components/OutbreakSimulator.jsx`
   - Each of the 6 evolutionary processes is a separate function
   - Easy to tweak parameters and add features

2. **Change colors/styling**: Edit `tailwind.config.js` or `src/index.css`

3. **Add new features**: Import more Lucide icons, add new components

4. **Deploy changes**: 
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
   GitHub Actions automatically rebuilds and deploys!

## Support & Questions

- See `README.md` for usage guide
- See `TECHNICAL_DOCUMENTATION.md` for how it works
- See `GITHUB_SETUP.md` for deployment help

---

**Ready to go live?** Follow `GITHUB_SETUP.md` for a step-by-step deployment guide!
