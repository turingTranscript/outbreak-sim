import React, { useState, useCallback, useEffect } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

const OutbreakSimulator = () => {
  // State variables
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [hosts, setHosts] = useState([]);
  const [stats, setStats] = useState({
    totalIndividuals: 0,
    wildtype: 0,
    resistant: 0,
    mutants: 0,
    avgFitness: 0,
    diversity: 0
  });
  const [parameters, setParameters] = useState({
    hostCount: 3,
    populationPerHost: 100,
    mutationRate: 0.05,
    drugResistanceMutationRate: 0.01,
    transmissionRate: 0.4,
    bottleneckSize: 10,
    drugPressure: 0.7,
    driftStrength: 0.1,
    recombinationRate: 0.02,
    migrationRate: 0.05,
    enableRecombination: true,
    enableMigration: true
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Individual structure: { type: 'WT'|'RES'|'MUT', fitness: number, mutations: Set<string> }
  const createIndividual = useCallback((type = 'WT', mutations = new Set()) => {
    let baseFitness = 1.0;
    let newMutations = new Set(mutations);

    if (type === 'RES') {
      baseFitness = 0.85; // Cost of resistance
      newMutations.add('drug_resistance');
    } else if (type === 'MUT') {
      baseFitness = 0.7 + Math.random() * 0.3;
      newMutations.add(`mut_${Date.now()}_${Math.random()}`);
    }

    // Apply fitness cost from mutations
    const fitnessCost = newMutations.size * 0.02;
    baseFitness = Math.max(0.1, baseFitness - fitnessCost);

    return {
      type,
      fitness: baseFitness,
      mutations: newMutations,
      age: 0
    };
  }, []);

  // Deep clone individual
  const cloneIndividual = (ind) => ({
    ...ind,
    mutations: new Set(ind.mutations)
  });

  // Initialize simulation
  const initializeSimulation = useCallback(() => {
    const newHosts = Array.from({ length: parameters.hostCount }).map((_, i) => ({
      id: i,
      population: Array.from({ length: parameters.populationPerHost }).map(() => createIndividual('WT'))
    }));
    setHosts(newHosts);
    setGeneration(0);
  }, [parameters, createIndividual]);

  // Calculate statistics
  const calculateStats = useCallback((hostList) => {
    const allIndividuals = hostList.flatMap(h => h.population);
    const total = allIndividuals.length;

    const typeCounts = allIndividuals.reduce((acc, ind) => {
      acc[ind.type] = (acc[ind.type] || 0) + 1;
      return acc;
    }, {});

    const avgFitness = allIndividuals.length > 0
      ? allIndividuals.reduce((sum, ind) => sum + ind.fitness, 0) / allIndividuals.length
      : 0;

    const uniqueMutations = new Set();
    allIndividuals.forEach(ind => {
      ind.mutations.forEach(mut => uniqueMutations.add(mut));
    });

    return {
      totalIndividuals: total,
      wildtype: typeCounts['WT'] || 0,
      resistant: typeCounts['RES'] || 0,
      mutants: typeCounts['MUT'] || 0,
      avgFitness: avgFitness.toFixed(3),
      diversity: uniqueMutations.size
    };
  }, []);

  // 1. MUTATION ROUND - includes drug resistance mutations
  const mutationRound = useCallback((hostList) => {
    return hostList.map(host => ({
      ...host,
      population: host.population.map(ind => {
        // Drug resistance mutation
        if (Math.random() < parameters.drugResistanceMutationRate) {
          const newMutations = new Set(ind.mutations);
          newMutations.add('drug_resistance');
          return {
            ...ind,
            type: 'RES',
            mutations: newMutations,
            fitness: Math.max(0.1, ind.fitness - 0.05) // Slight fitness cost
          };
        }

        // Other mutations
        if (Math.random() < parameters.mutationRate) {
          const newMutations = new Set(ind.mutations);
          newMutations.add(`mut_${generation}_${Math.random()}`);
          return {
            ...ind,
            type: 'MUT',
            mutations: newMutations,
            fitness: Math.max(0.1, ind.fitness - 0.02)
          };
        }

        return ind;
      })
    }));
  }, [parameters.mutationRate, parameters.drugResistanceMutationRate, generation]);

  // 2. TRANSMISSION BOTTLENECK
  const transmissionBottleneck = useCallback((hostList) => {
    return hostList.map((host, hostIdx) => {
      if (hostList.length === 1) return host;

      if (Math.random() < parameters.transmissionRate) {
        const otherHostIdx = (hostIdx + 1) % hostList.length;
        const sourceHost = hostList[otherHostIdx];

        if (sourceHost.population.length === 0) return host;

        const bottleneckedPop = [];
        for (let i = 0; i < parameters.bottleneckSize; i++) {
          const sourceInd = sourceHost.population[
            Math.floor(Math.random() * sourceHost.population.length)
          ];
          bottleneckedPop.push(cloneIndividual(sourceInd));
        }

        return {
          ...host,
          population: [...host.population.slice(0, -parameters.bottleneckSize), ...bottleneckedPop]
        };
      }
      return host;
    });
  }, [parameters.transmissionRate, parameters.bottleneckSize]);

  // 3. DRUG SELECTION - kills wild-type preferentially
  const drugSelection = useCallback((hostList) => {
    return hostList.map(host => {
      const resistant = host.population.filter(ind => 
        ind.mutations.has('drug_resistance')
      );

      // Only apply drug pressure if there's at least one resistant individual
      if (resistant.length > 0 && Math.random() < parameters.drugPressure) {
        const surviving = host.population.filter(ind => {
          // Resistant strains survive well
          if (ind.mutations.has('drug_resistance')) {
            return Math.random() < 0.90;
          }
          // Wild-type dies
          return Math.random() < 0.05;
        });

        return {
          ...host,
          population: surviving.length > 0 ? surviving : host.population
        };
      }
      return host;
    });
  }, [parameters.drugPressure]);

  // 4. DRIFT SAMPLING
  const driftSampling = useCallback((hostList) => {
    return hostList.map(host => {
      if (host.population.length === 0) return host;

      const popSize = Math.max(
        Math.floor(host.population.length * (1 - parameters.driftStrength * 0.1)),
        Math.max(1, Math.floor(host.population.length * 0.5))
      );

      const driftedPop = [];
      for (let i = 0; i < popSize; i++) {
        const ind = host.population[Math.floor(Math.random() * host.population.length)];
        driftedPop.push(cloneIndividual(ind));
      }

      const weights = driftedPop.map(ind => ind.fitness);
      const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
      const recovered = [];

      while (recovered.length < host.population.length) {
        let random = Math.random() * totalWeight;
        for (let i = 0; i < driftedPop.length; i++) {
          random -= weights[i];
          if (random <= 0) {
            recovered.push(cloneIndividual(driftedPop[i]));
            break;
          }
        }
      }

      return {
        ...host,
        population: recovered
      };
    });
  }, [parameters.driftStrength]);

  // 5. RECOMBINATION/HGT
  const recombinationRound = useCallback((hostList) => {
    if (!parameters.enableRecombination) return hostList;

    return hostList.map(host => {
      const newPop = host.population.map(ind => {
        if (host.population.length > 1 && Math.random() < parameters.recombinationRate) {
          const partner = host.population[
            Math.floor(Math.random() * host.population.length)
          ];

          const combinedMutations = new Set([
            ...ind.mutations,
            ...partner.mutations
          ]);

          const selectedMutations = new Set();
          combinedMutations.forEach(mut => {
            if (Math.random() < 0.5) {
              selectedMutations.add(mut);
            }
          });

          return {
            ...ind,
            mutations: selectedMutations,
            fitness: Math.max(0.1, (ind.fitness + partner.fitness) / 2 - 0.01)
          };
        }
        return ind;
      });

      return { ...host, population: newPop };
    });
  }, [parameters.enableRecombination, parameters.recombinationRate]);

  // 6. MIGRATION BETWEEN HOSTS
  const migrationRound = useCallback((hostList) => {
    if (!parameters.enableMigration || hostList.length < 2) return hostList;

    const newHosts = hostList.map(h => ({
      ...h,
      population: h.population.map(p => cloneIndividual(p))
    }));

    hostList.forEach((host, hostIdx) => {
      const migrants = Math.floor(host.population.length * parameters.migrationRate);
      
      if (migrants > 0 && host.population.length > 0) {
        const targetHostIdx = Math.floor(Math.random() * (hostList.length - 1));
        const actualTargetIdx = targetHostIdx >= hostIdx ? targetHostIdx + 1 : targetHostIdx;

        for (let i = 0; i < migrants; i++) {
          const migrant = host.population[Math.floor(Math.random() * host.population.length)];
          newHosts[actualTargetIdx].population.push(cloneIndividual(migrant));
        }

        newHosts[hostIdx].population = newHosts[hostIdx].population.slice(0, -migrants);
      }
    });

    return newHosts;
  }, [parameters.enableMigration, parameters.migrationRate]);

  // Population regulation
  const regulatePopulation = useCallback((hostList) => {
    return hostList.map(host => ({
      ...host,
      population: host.population.slice(0, parameters.populationPerHost)
    }));
  }, [parameters.populationPerHost]);

  // Main simulation step
  const simulationStep = useCallback(() => {
    setHosts(prevHosts => {
      let newHosts = prevHosts;

      newHosts = mutationRound(newHosts);
      newHosts = transmissionBottleneck(newHosts);
      newHosts = drugSelection(newHosts);
      newHosts = driftSampling(newHosts);
      newHosts = recombinationRound(newHosts);
      newHosts = migrationRound(newHosts);
      newHosts = regulatePopulation(newHosts);

      const newStats = calculateStats(newHosts);
      setStats(newStats);

      setGeneration(prev => prev + 1);
      return newHosts;
    });
  }, [mutationRound, transmissionBottleneck, drugSelection, driftSampling, 
      recombinationRound, migrationRound, regulatePopulation, calculateStats]);

  // Main loop
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(simulationStep, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning, simulationStep]);

  // Initialize on mount
  useEffect(() => {
    initializeSimulation();
  }, [initializeSimulation]);

  const handleReset = () => {
    setIsRunning(false);
    initializeSimulation();
  };

  const handleQuickStep = () => {
    simulationStep();
  };

  // Get colors for visualization
  const getColor = (individual) => {
    if (individual.mutations.has('drug_resistance')) {
      return '#ef4444';
    }
    if (individual.type === 'MUT') {
      return '#f59e0b';
    }
    return '#3b82f6';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-white mb-2">Compressed Outbreak Simulator</h1>
      <p className="text-slate-300 mb-6">Simulates viral/bacterial outbreak dynamics with mutation, transmission, drug selection, drift, recombination, and migration.</p>

      {/* Controls */}
      <div className="bg-slate-700 rounded-lg p-4 mb-6 space-y-4">
        <div className="flex gap-3 items-center flex-wrap">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
            {isRunning ? 'Pause' : 'Start'}
          </button>

          <button
            onClick={handleQuickStep}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            <Zap size={20} />
            Step
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold transition"
          >
            <RotateCcw size={20} />
            Reset
          </button>

          <div className="ml-auto text-white font-mono">
            Generation: <span className="text-green-400">{generation}</span>
          </div>
        </div>

        {/* Parameter controls */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-slate-300 hover:text-white text-sm underline"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Parameters
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-200">
            {Object.entries(parameters).map(([key, value]) => {
              if (typeof value === 'boolean') {
                return (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setParameters(p => ({ ...p, [key]: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                );
              }
              return (
                <div key={key}>
                  <label className="block capitalize text-xs mb-1">
                    {key.replace(/([A-Z])/g, ' $1')}: {typeof value === 'number' && value < 1 ? value.toFixed(3) : value}
                  </label>
                  <input
                    type="range"
                    min={key.includes('Count') ? 1 : 0}
                    max={key.includes('Count') ? 10 : 1}
                    step={key.includes('Count') ? 1 : 0.01}
                    value={value}
                    onChange={(e) => {
                      const newVal = key.includes('Count') ? parseInt(e.target.value) : parseFloat(e.target.value);
                      setParameters(p => ({ ...p, [key]: newVal }));
                    }}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-600 rounded-lg p-4">
          <div className="text-sm text-blue-100">Wild-type</div>
          <div className="text-2xl font-bold text-white">{stats.wildtype}</div>
        </div>
        <div className="bg-red-600 rounded-lg p-4">
          <div className="text-sm text-red-100">Drug Resistant</div>
          <div className="text-2xl font-bold text-white">{stats.resistant}</div>
        </div>
        <div className="bg-amber-600 rounded-lg p-4">
          <div className="text-sm text-amber-100">Mutants</div>
          <div className="text-2xl font-bold text-white">{stats.mutants}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-300">Avg Fitness</div>
          <div className="text-xl font-bold text-green-400">{stats.avgFitness}</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-300">Genetic Diversity</div>
          <div className="text-xl font-bold text-purple-400">{stats.diversity}</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-300">Total Population</div>
          <div className="text-xl font-bold text-cyan-400">{stats.totalIndividuals}</div>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-slate-700 rounded-lg p-4">
        <h2 className="text-white font-bold mb-4">Host Populations</h2>
        <div className="space-y-4">
          {hosts.map((host) => (
            <div key={host.id}>
              <div className="text-slate-300 text-sm font-semibold mb-2">Host {host.id + 1} ({host.population.length} individuals)</div>
              <div className="bg-slate-900 rounded p-3 h-16 overflow-hidden flex flex-wrap items-center gap-1 content-start">
                {host.population.slice(0, 100).map((ind, idx) => (
                  <div
                    key={idx}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getColor(ind) }}
                    title={`Type: ${ind.type}, Fitness: ${ind.fitness.toFixed(2)}, Mutations: ${ind.mutations.size}`}
                  />
                ))}
                {host.population.length > 100 && (
                  <div className="text-slate-400 text-xs ml-2">+{host.population.length - 100} more</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          <span>Wild-type</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Drug Resistant</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>Other Mutants</span>
        </div>
      </div>
    </div>
  );
};

export default OutbreakSimulator;
