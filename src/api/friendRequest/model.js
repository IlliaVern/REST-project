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
    enums: ['accept', 'reject', 'pending'],
    default: 'pending'
  }
})

friendRequestSchema.methods = {
  view(full) {
    const view = {}
    let fields = ['id', 'requester', 'recipient']

    if (full) {
      fields = [...fields, 'status']
    }

    fields.forEach((field) => {
      view[field] = this[field]
    })

    return view
  }
}

const model = mongoose.model('FriendRequest', friendRequestSchema)

export const schema = model.schema
export default model
