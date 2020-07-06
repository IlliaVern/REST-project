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

friendSchema.methods = {
  view(full) {
    const view = {}
    let fields = ['id', 'friend1', 'friend2']

    if (full) {
      fields = [...fields]
    }

    fields.forEach((field) => {
      view[field] = this[field]
    })
    return view
  }
}

const model = mongoose.model('Friend', friendSchema)

export const schema = model.schema
export default model
