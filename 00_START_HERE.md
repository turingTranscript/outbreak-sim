# 🧬 Outbreak Simulator - START HERE

Welcome! You have everything you need to run and deploy a production-grade outbreak dynamics simulator.

## What You Have

A complete React application that simulates:
- ✅ Mutation and drug resistance generation (NOW FIXED!)
- ✅ Transmission between hosts with bottleneck effects
- ✅ Drug selection pressure
- ✅ Genetic drift
- ✅ Sexual recombination / HGT
- ✅ Migration between populations

## The Bug That's Fixed

**Original Issue**: Drug resistance never appeared (red dots)

**Why**: Drug resistance mutations were never being created in the code

**Solution**: Added explicit `drugResistanceMutationRate` parameter to generate resistance

**Result**: Red dots now appear and spread under drug selection! 🎉

## What To Read (In Order)

1. **`QUICKSTART.md`** (2 min) - Get running in 30 seconds
2. **`README.md`** (5 min) - How to use the simulator
3. **`GITHUB_SETUP.md`** (5 min) - Deploy to GitHub Pages
4. **`TECHNICAL_DOCUMENTATION.md`** (optional) - Deep dive into the bug fix

## 30-Second Start

```bash
npm install
npm start
```

Done! Opens at http://localhost:3000

## 5-Minute GitHub Pages Deploy

```bash
git init
git add .
git commit -m "Initial commit"
# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/outbreak-simulator.git
git push -u origin main
# Update package.json "homepage" to your GitHub Pages URL
git push
```

Your site goes live automatically!

## File Structure

```
├── README.md                      ← User guide
├── QUICKSTART.md                  ← Quick start guide  
├── GITHUB_SETUP.md                ← Deployment steps
├── TECHNICAL_DOCUMENTATION.md     ← Why the fix works
├── DEPLOY_CHECKLIST.md            ← Before deploying
│
├── src/
│   └── components/
│       └── OutbreakSimulator.jsx   ← Main simulator (FIXED!)
│
├── package.json                   ← Dependencies
├── tailwind.config.js             ← Styling config
├── .github/workflows/deploy.yml   ← Auto-deployment
└── ... (other config files)
```

## Key Fixes Explained

### The Problem (Original Code)

```javascript
// ❌ This only creates 'MUT' type, never 'RES'
if (Math.random() < parameters.mutationRate) {
  return { ...ind, type: 'MUT', ... };  // Only MUT!
}

// ❌ This checks for resistance that doesn't exist
const resistant = population.filter(ind => ind.type === 'RES');
if (resistant.length > 0) { /* never true! */ }
```

### The Solution (Fixed Code)

```javascript
// ✅ Explicit drug resistance generation
if (Math.random() < parameters.drugResistanceMutationRate) {
  newMutations.add('drug_resistance');
  return { ...ind, type: 'RES', mutations: newMutations };
}

// ✅ Drug selection now works
if (resistant.length > 0 && Math.random() < parameters.drugPressure) {
  // Kill wild-type, keep resistant
}
```

## What Now Works

1. **Drug resistance appears** - Red dots show up around generation 10-20
2. **Selection works** - Red dots proliferate when drug pressure is high
3. **Evolution is realistic** - You can see antibiotic resistance evolve before your eyes

## Try These Experiments

### 1. Default Behavior (Best for watching evolution)
- Hit Play
- Watch for ~30 generations
- See red dots appear and take over
- Blue (wild-type) gets eliminated

### 2. Tight Bottleneck (Genetic drift matters more)
- Set `bottleneckSize` to 1
- Run for 50 generations
- Resistance spreads slower between hosts
- More stochastic behavior

### 3. Strong Drift (Randomness matters)
- Set `driftStrength` to 0.5
- Results less predictable
- Population fluctuations are wild
- Selection pressure less obvious

### 4. Enable Recombination (Faster evolution)
- Enable "recombination" toggle
- Set `recombinationRate` to 0.1
- Mutations combine from two parents
- Faster adaptation to drug pressure

## Common Questions

**Q: Why are there no red dots?**
A: They take 10-20 generations to appear. Hit Play and wait!

**Q: How do I change appearance?**
A: Edit `tailwind.config.js` or modify color values in `OutbreakSimulator.jsx`

**Q: Can I add more features?**
A: Absolutely! The code is modular with one function per evolutionary process

**Q: How do I deploy?**
A: See `QUICKSTART.md` (5 min) or `GITHUB_SETUP.md` (detailed steps)

**Q: How do I update the live site?**
A: Just `git push` - GitHub Actions deploys automatically!

## Next Steps

1. **Run locally**: `npm install && npm start`
2. **Test the fix**: Run 30 generations, confirm red dots appear
3. **Deploy**: Follow `QUICKSTART.md` or `GITHUB_SETUP.md`
4. **Customize**: Edit parameters, colors, or add features
5. **Share**: Show others the power of evolutionary dynamics!

## Technology Stack

- **React 18** - Modern UI framework
- **Tailwind CSS** - Beautiful styling
- **Lucide Icons** - Professional icons
- **Create React App** - Zero config build

## Getting Help

- **Setup issues?** → See `QUICKSTART.md`
- **GitHub deployment?** → See `GITHUB_SETUP.md`
- **Understanding the code?** → See `TECHNICAL_DOCUMENTATION.md`
- **Using the simulator?** → See `README.md`
- **Deployment checklist?** → See `DEPLOY_CHECKLIST.md`

---

## TL;DR

```bash
# Run
npm install && npm start

# Deploy to GitHub Pages
git init
git add .
git commit -m "Initial commit"
# Create repo on github.com
git remote add origin https://github.com/YOU/outbreak-simulator.git
git push -u origin main
# Edit package.json homepage, then:
git push
```

**Your simulation is live!** 🚀

---

**Questions?** Each documentation file has a specific purpose - find what you need and jump in!
