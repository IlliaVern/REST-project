import mongoose, { Schema } from 'mongoose'

const friendRequestSchema = new Schema({
  requester: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
    enums: ['accepted', 'denied', 'pending'],
    default: 'pending'
  }
})

const model = mongoose.model('FriendRequest', friendRequestSchema)

export const schema = model.schema
export default model
