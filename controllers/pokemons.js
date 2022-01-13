import { NotFound, Unauthorized } from '../lib/errors.js'
import Pokemon from '../models/pokemon.js'

async function pokemonIndex(_req, res) {
  const pokemons = await Pokemon.find().populate('addedBy')
  return res.status(200).json(pokemons)
}

async function pokemonCreate(req, res, next) {
  req.body.addedBy = req.currentUser
  try {
    const createdPokemon = await Pokemon.create(req.body)
    return res.status(200).json(createdPokemon)
  } catch (err) {
    next(err)
  }
}

async function pokemonShow(req, res, next) {
  const { pokemonId } = req.params
  try {
    const pokemonToFind = await Pokemon
      .findById(pokemonId)
      .populate('addedBy')
      .populate('caughtBy')
    if (!pokemonToFind) {
      throw new NotFound()
    }
    return res.status(200).json(pokemonToFind)
  } catch (err) {
    next(err)
  }
}

async function pokemonUpdate(req, res, next) {
  const { pokemonId } = req.params
  try {
    const pokemonToUpdate = await Pokemon.findById(pokemonId)
    if (!pokemonToUpdate) {
      throw new NotFound()
    }
    if (!pokemonToUpdate.addedBy.equals(req.currentUser)) {
      throw new Unauthorized()
    }
    Object.assign(pokemonToUpdate, req.body)
    await pokemonToUpdate.save()
    return res.status(202).json(pokemonToUpdate)
  } catch (err) {
    next(err)
  }
}

async function pokemonDelete(req, res, next) {
  const { pokemonId } = req.params
  try {
    const pokemonToRemove = await Pokemon.findById(pokemonId)
    if (!pokemonToRemove) {
      throw new NotFound()
    }
    if (!pokemonToRemove.addedBy.equals(req.currentUser)) {
      throw new Unauthorized()
    }
    await pokemonToRemove.remove()
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

async function pokemonCommentCreate(req, res, next) {
  const { pokemonId } = req.params
  try {
    const pokemon = await Pokemon.findById(pokemonId)
    if (!pokemon) {
      throw new NotFound()
    }
    pokemon.comments.push(req.body)
    await pokemon.save()
    return res.status(201).json(pokemon)
  } catch (err) {
    next(err)
  }
}

async function pokemonCommentDelete(req, res, next) {
  const { pokemonId, commentId } = req.params
  try {
    const pokemon = await Pokemon.findById(pokemonId)
    if (!pokemon) {
      throw new NotFound()
    }
    const commentToDelete = pokemon.comments.id(commentId)
    if (!commentToDelete) {
      throw new NotFound()
    }
    commentToDelete.remove()
    await pokemon.save()
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

async function pokemonCatch(req, res, next) {
  const { pokemonId } = req.params
  try {
    const pokemonToCatch = await Pokemon.findById(pokemonId)
    if (!pokemonToCatch) {
      throw new NotFound()
    }
    const userId = req.currentUser._id
    if (pokemonToCatch.caughtBy.includes(userId)) {
      pokemonToCatch.caughtBy.remove(userId)
    } else {
      pokemonToCatch.caughtBy.push(userId)
    }
    await pokemonToCatch.save()
    return res.status(202).json(pokemonToCatch)
  } catch (err) {
    next(err)
  }
}

export default {
  index: pokemonIndex,
  create: pokemonCreate,
  show: pokemonShow,
  update: pokemonUpdate,
  delete: pokemonDelete,
  commentCreate: pokemonCommentCreate,
  commentDelete: pokemonCommentDelete,
  catch: pokemonCatch,
}

