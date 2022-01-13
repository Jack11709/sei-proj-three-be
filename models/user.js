import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxLength: 50 },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
})

userSchema
  .virtual('caughtPokemon', {
    ref: 'Pokemon',
    localField: '_id',
    foreignField: 'caughtBy',
  })
  .get(function (caughtPokemon) {
    if (!caughtPokemon) return null

    return caughtPokemon.map(pokemon => ({
      _id: pokemon._id,
      name: pokemon.name,
      sprite: pokemon.sprite,
    }))
  })

userSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, json) {
    delete json.password
    return json
  },
})

userSchema
  .virtual('passwordConfirmation')
  .set(function (passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })


userSchema
  .pre('validate', function(next) {
    if (this.isModified('password') && this.password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'Does Not Match')
    }
    next()
  })

userSchema
  .pre('save', function(next) {
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
    }
    next()
  })

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

userSchema.plugin(mongooseUniqueValidator)

export default mongoose.model('User', userSchema)
