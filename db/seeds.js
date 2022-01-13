import { connectDb, disconnectDb, truncateDb } from './helpers.js'
import Pokemon from '../models/pokemon.js'
import User from '../models/user.js'
import pokemonData from './data/pokemon.js'

async function seed() {
  try {
    await connectDb()
    console.log('🤖 Database Connected')

    await truncateDb()
    console.log('🤖 Data Dropped')

    const user = await User.create({
      username: 'admin',
      email: 'admin@email',
      password: 'pass',
      passwordConfirmation: 'pass',
    })
    console.log('🤖 Admin user created')

    const pokemonDataWithUsers = pokemonData.map(pokemon => {
      pokemon.addedBy = user
      return pokemon
    })

    const createdPokemon = await Pokemon.create(pokemonDataWithUsers)
    console.log(`🤖 ${createdPokemon.length} pokemon created`)

  } catch (err) {
    console.log('🤖 Something went wrong seeding the DB')
    console.log(err)
  }
  await disconnectDb()
  console.log('🤖 Goodbye')
}

seed()
