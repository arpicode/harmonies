import GeneticAlgorithm from './GeneticAlgorithm'

const ga = new GeneticAlgorithm(100, 0.0, 50)
const ch = ga.run()

console.log(ch.evaluateFitness())
