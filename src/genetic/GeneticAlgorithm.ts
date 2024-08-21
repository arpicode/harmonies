import Token, { TokenType } from '../board/Token'
import Chromosome from './Chromosome'

export default class GeneticAlgorithm {
  public population: Chromosome[]
  private readonly populationSize: number
  private readonly mutationRate: number
  private readonly generations: number

  constructor(populationSize: number, mutationRate: number, generations: number) {
    this.populationSize = populationSize
    this.mutationRate = mutationRate
    this.generations = generations
    this.population = this._initializePopulation()
  }

  private _initializePopulation(): Chromosome[] {
    const population: Chromosome[] = []
    for (let i = 0; i < this.populationSize; i++) {
      const chromosome = new Chromosome(5, 5)
      chromosome.initialize(9)
      population.push(chromosome)
    }
    return population
  }

  private _getRandomTokenType(): TokenType {
    const tokenTypes = Object.values(TokenType)
    return tokenTypes[Math.floor(Math.random() * tokenTypes.length)]
  }

  private _selectParents(): Chromosome[] {
    const sortedPopulation = this.population.sort((a, b) => b.evaluateFitness() - a.evaluateFitness())
    return sortedPopulation.slice(0, this.populationSize / 2)
  }

  private _crossover(parent1: Chromosome, parent2: Chromosome): Chromosome {
    let child: Chromosome

    do {
      child = new Chromosome(parent1.cols, parent1.rows)
      for (const [key, hex] of parent1.hexes) {
        const parentHex = Math.random() < 0.5 ? parent1.getHex(hex.q, hex.r) : parent2.getHex(hex.q, hex.r)
        if (parentHex) {
          child.hexes.set(key, parentHex)
        }
      }
    } while (!parent1.hasEqualTokenTypesCount(child) && !parent2.hasEqualTokenTypesCount(child))

    return child
  }

  private _mutate(hexBoard: Chromosome): void {
    for (const hex of hexBoard.hexes.values()) {
      if (Math.random() < this.mutationRate) {
        const randomTokenType = this._getRandomTokenType()
        if (!hex.tokens.isEmpty() && hex.tokens.isTokenPlaceable(new Token(randomTokenType))) {
          hex.tokens.push(new Token(randomTokenType))
        }
      }
    }
  }

  public run(): Chromosome {
    console.log('Running genetic algorithm...')
    for (let generation = 0; generation < this.generations; generation++) {
      const parents = this._selectParents()
      const newPopulation: Chromosome[] = []

      while (newPopulation.length < this.populationSize) {
        const parent1 = parents[Math.floor(Math.random() * parents.length)]
        const parent2 = parents[Math.floor(Math.random() * parents.length)]
        const child = this._crossover(parent1, parent2)
        this._mutate(child)
        newPopulation.push(child)
      }

      this.population = newPopulation
      console.log(
        `Generation ${generation + 1}: ${this.population
          .sort((a, b) => b.evaluateFitness() - a.evaluateFitness())[0]
          .evaluateFitness()}`
      )
    }

    return this.population.sort((a, b) => b.evaluateFitness() - a.evaluateFitness())[0]
  }
}
