import { NotFound, Unauthorized } from '../lib/errors.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import { secret } from '../config/environment.js'

async function register(req, res, next) {
  try {
    const user = await User.create(req.body)
    return res.status(201).json({ message: `Welcome ${user.username}` })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const userToLogin = await User.findOne({ email: req.body.email })
    if (!userToLogin || !userToLogin.validatePassword(req.body.password)) {
      throw new Unauthorized()
    }
    const token = jwt.sign({ sub: userToLogin._id }, secret, { expiresIn: '7 days' })
    return res.status(202).json({
      message: `Welcome back ${userToLogin.username}`,
      token,
    })
  } catch (err) {
    next(err)
  }
}

async function profile(req, res, next) {
  const { userId } = req.params
  try {
    const user = await User.findById(userId).populate('caughtPokemon')
    if (!user) {
      throw new NotFound()
    }
    return res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

export default {
  register,
  login,
  profile,
}

