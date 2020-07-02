import mongoose, { Schema } from 'mongoose'

const friendSchema = new Schema({
  friend1: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  friend2: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

const model = mongoose.model('Friend', friendSchema)

export const schema = model.schema
export default model
