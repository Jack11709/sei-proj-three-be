import express from 'express'
import pokemons from '../controllers/pokemons.js'
import auth from '../controllers/auth.js'
import secureRoute from '../lib/secureRoute.js'

const router = express.Router()

router.route('/pokemon')
  .get(pokemons.index)
  .post(secureRoute, pokemons.create)

router.route('/pokemon/:pokemonId')
  .get(pokemons.show)
  .put(secureRoute, pokemons.update)
  .delete(secureRoute, pokemons.delete)

router.route('/pokemon/:pokemonId/comments')
  .post(secureRoute, pokemons.commentCreate)

router.route('/pokemon/:pokemonId/comments/:commentId')
  .delete(secureRoute, pokemons.commentDelete)

router.route('/pokemon/:pokemonId/catch')
  .post(secureRoute, pokemons.catch)

router.route('/register')
  .post(auth.register)

router.route('/login')
  .post(auth.login)

router.route('/profile/:userId')
  .get(auth.profile)

export default router
