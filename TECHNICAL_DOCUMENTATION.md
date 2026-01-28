# Technical Documentation: Drug Resistance Bug Fix

## The Problem: Why Drug Resistance Wasn't Appearing

The original implementation had a critical flaw in how drug resistance was generated:

### Original (Broken) Code

```javascript
// 1. MUTATION ROUND
const mutationRound = (hostList) => {
  return hostList.map(host => ({
    ...host,
    population: host.population.map(ind => {
      if (Math.random() < parameters.mutationRate) {
        // Only created generic 'MUT' type, never 'RES'
        newMutations.add(`mut_${generation}_${Math.random()}`);
        return {
          ...ind,
          type: 'MUT',  // <-- PROBLEM: Only 'MUT', never 'RES'
          mutations: newMutations,
          fitness: Math.max(0.1, ind.fitness - 0.02)
        };
      }
      return ind;
    })
  }));
};

// 3. DRUG SELECTION (checking for resistance that never existed!)
const drugSelection = (hostList) => {
  const resistant = host.population.filter(ind => 
    ind.mutations.has(drugResistanceGene) || ind.type === 'RES'  // Never true!
  );
};
```

### Root Causes

1. **No dedicated drug resistance mutation pathway**: The mutation round only created random mutations with type 'MUT', never specifically generating the `drug_resistance` mutation
2. **Drug selection had no trigger**: Without any individuals having the `drug_resistance` mutation, the condition `resistant.length > 0` was always false
3. **Circular logic**: The simulation was checking for drug resistance but never creating it, so nothing happened

### The Solution

The fixed version introduces a **separate mutation pathway for drug resistance**:

```javascript
// 1. MUTATION ROUND (FIXED)
const mutationRound = useCallback((hostList) => {
  return hostList.map(host => ({
    ...host,
    population: host.population.map(ind => {
      // Drug resistance mutation - EXPLICIT PATHWAY
      if (Math.random() < parameters.drugResistanceMutationRate) {
        const newMutations = new Set(ind.mutations);
        newMutations.add('drug_resistance');  // ✓ Creates the resistance
        return {
          ...ind,
          type: 'RES',  // ✓ Sets type to RES
          mutations: newMutations,
          fitness: Math.max(0.1, ind.fitness - 0.05) // Fitness cost
        };
      }

      // Other mutations - unchanged
      if (Math.random() < parameters.mutationRate) {
        // ... creates 'MUT' type
      }

      return ind;
    })
  }));
}, [parameters.mutationRate, parameters.drugResistanceMutationRate, generation]);
```

### Key Changes in the Fix

#### 1. New Parameter: `drugResistanceMutationRate`
```javascript
parameters: {
  ...
  drugResistanceMutationRate: 0.01,  // 1% per generation
  ...
}
```

#### 2. Explicit Drug Resistance Generation
- Separate `if` statement checking `drugResistanceMutationRate`
- Directly adds `'drug_resistance'` to mutations set
- Sets individual type to `'RES'`

#### 3. Improved Drug Selection Logic
```javascript
const drugSelection = useCallback((hostList) => {
  return hostList.map(host => {
    const resistant = host.population.filter(ind => 
      ind.mutations.has('drug_resistance')  // Now this can be true!
    );

    // Only apply drug if there's at least one resistant individual
    if (resistant.length > 0 && Math.random() < parameters.drugPressure) {
      const surviving = host.population.filter(ind => {
        // Resistant strains survive well
        if (ind.mutations.has('drug_resistance')) {
          return Math.random() < 0.90;  // 90% survival
        }
        // Wild-type dies
        return Math.random() < 0.05;  // Only 5% survive
      });

      return {
        ...host,
        population: surviving.length > 0 ? surviving : host.population
      };
    }
    return host;
  });
}, [parameters.drugPressure]);
```

### Why This Works

1. **Generation**: `drugResistanceMutationRate` ensures drug-resistant strains are created
2. **Detection**: Drug selection can now find individuals with `'drug_resistance'` mutation
3. **Selection**: When found, strong drug pressure eliminates wild-type (95% death) while resistant survive (90% death)
4. **Visualization**: Red dots now appear and spread when resistant strains take over

## Expected Behavior After Fix

### Simulation Stages

1. **Generations 0-5**: All wild-type (blue), occasional mutants (amber)
2. **Generations 5-20**: Drug resistance mutations appear (red dots)
3. **Generations 20+**: If drug pressure is high, red spreads and blue disappears
4. **Final state**: Population dominated by drug-resistant strains (red)

### Parameter Tweaking Tips

To observe drug resistance evolution clearly:

```javascript
{
  drugResistanceMutationRate: 0.02,  // Increase from 0.01 for faster appearance
  drugPressure: 0.8,                  // High pressure kills wild-type
  populationPerHost: 200,             // Larger population = more mutations
}
```

## Architecture Insights

### Individual Structure
```javascript
{
  type: 'WT' | 'RES' | 'MUT',
  fitness: number (0.0-1.0),
  mutations: Set<string>,
  age: number
}
```

### Mutation Set Examples
```javascript
// Wild-type
mutations = new Set()

// Drug resistant
mutations = new Set(['drug_resistance'])

// Resistant with other mutations
mutations = new Set(['drug_resistance', 'mut_50_0.234', 'mut_60_0.912'])
```

## Testing the Fix

To verify the fix works:

1. Start simulation with default parameters
2. Click "Step" several times (advance ~20 generations)
3. Look for **red dots** in host populations
4. Increase `drugPressure` slider to 0.8-1.0
5. Watch red dots proliferate and blue disappear
6. Check statistics: "Drug Resistant" count increases

## Performance Considerations

The fix maintains O(n) complexity per generation where n = total population size:

- Mutation: O(n) - each individual checked
- Drug selection: O(n) - linear filter
- All other steps: O(n) or O(n log n) depending on resampling

No significant performance impact from the bug fix.

## Future Enhancements

Possible improvements:

1. **Multi-drug resistance**: Multiple independent resistance mutations
2. **Epistasis**: Fitness effects dependent on mutation combinations
3. **Fitness landscapes**: Structured space where certain mutations are better together
4. **Time-varying drug pressure**: Realistic treatment schedules
5. **Within-host dynamics**: Individual-level modeling within each host
