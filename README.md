# Outbreak Simulator

An interactive visualization of pathogen outbreak dynamics with mutation, transmission bottlenecks, drug selection, genetic drift, recombination, and migration between host populations.

## Features

- **Mutation Round**: Individuals randomly acquire mutations, including drug resistance
- **Transmission Bottleneck**: Pathogens spread between hosts through a limited bottleneck, causing genetic drift during transfer
- **Drug Selection**: Drug pressure eliminates wild-type individuals while resistant strains survive
- **Drift Sampling**: Random fluctuations in population size simulate genetic drift effects
- **Optional Recombination/HGT**: Horizontal gene transfer allows individuals to exchange genetic material
- **Migration Between Hosts**: Individuals migrate between host populations with configurable rates

## Real-time Statistics

- **Wild-type Count**: Population of unmodified individuals
- **Drug Resistant Count**: Population with drug resistance mutations
- **Other Mutants**: Population with non-resistance mutations
- **Average Fitness**: Mean fitness across all individuals
- **Genetic Diversity**: Number of unique mutations in the population
- **Total Population**: Total individuals across all hosts

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

This runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build for Production

```bash
npm run build
```

Builds the app for production to the `build` folder.

## Usage

1. **Start/Pause**: Use the Play/Pause button to run continuous simulation or step through manually
2. **Step**: Advance one generation with the Step button (disabled while running)
3. **Reset**: Restart the simulation with fresh parameters
4. **Advanced Parameters**: Toggle to adjust simulation parameters in real-time:
   - **hostCount**: Number of host populations (1-10)
   - **populationPerHost**: Individuals per host (10-1000)
   - **mutationRate**: Probability of random mutations per generation
   - **drugResistanceMutationRate**: Probability of acquiring drug resistance
   - **transmissionRate**: Probability of transmission between hosts
   - **bottleneckSize**: Number of individuals transmitted
   - **drugPressure**: Strength of drug selection pressure
   - **driftStrength**: Strength of random genetic drift
   - **recombinationRate**: Probability of sexual recombination
   - **migrationRate**: Proportion of population migrating
   - **enableRecombination**: Toggle recombination on/off
   - **enableMigration**: Toggle migration on/off

## Understanding the Visualization

Each small circle represents an individual in a host population:

- **Blue**: Wild-type (no mutations)
- **Red**: Drug-resistant strain
- **Amber**: Other mutants

Hover over circles to see detailed information about that individual's fitness and mutations.

## Key Observations

Try these experiments to understand outbreak dynamics:

1. **Drug Resistance Evolution**: Increase `drugResistanceMutationRate` to see resistant strains emerge quickly, then watch them take over under drug selection
2. **Bottleneck Effects**: Reduce `bottleneckSize` to see how limited transmission reduces genetic diversity
3. **Drift vs Selection**: Compare results with high and low drift strength to see how random effects interact with selection
4. **Migration Impact**: Toggle migration on/off to see how connected populations share genetic innovations
5. **Recombination Benefits**: Enable recombination to see faster adaptation through genetic mixing

## Technology Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Scripts** - Build tooling

## Deployment

### Deploy to GitHub Pages

1. Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/outbreak-simulator"
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add deploy scripts to `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
  ...
}
```

4. Deploy:
```bash
npm run deploy
```

### Deploy to Vercel

1. Push to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Vercel automatically detects and deploys React apps

### Deploy to Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `build`
4. Deploy!

## File Structure

```
outbreak-simulator/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── OutbreakSimulator.jsx
│   ├── App.jsx
│   ├── index.css
│   └── index.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

## References

- Population genetics concepts from Hartl & Clark
- Evolutionary dynamics inspired by Nowak's work
- Drug resistance modeling based on WHO surveillance data
