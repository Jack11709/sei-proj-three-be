import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 300 },
  rating: { type: Number, required: true, min: 1, max: 5 },
} , {
  timestamps: true,
})

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  number: { type: Number, required: true, unique: true },
  types: [{ type: String, required: true }],
  pokedexEntry: { type: String, required: true, maxLength: 500 },
  sprite: { type: String, required: true },
  image: { type: String, required: true },
  comments: [commentSchema],
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  caughtBy: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
})

pokemonSchema
  .virtual('avgRating')
  .get(function() {
    if (!this.comments.length) return 'No Average Rating'

    return Math.round(this.comments.reduce((acc, curr) => {
      return acc + curr.rating
    }, 0) / this.comments.length)
  })

pokemonSchema
  .set('toJSON', {
    virtuals: true,
  })

pokemonSchema.plugin(mongooseUniqueValidator)

export default mongoose.model('Pokemon', pokemonSchema)
