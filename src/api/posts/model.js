import mongoose, { Schema } from 'mongoose'

const postsSchema = new Schema(
  {
    createdBy: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (obj, ret) => {
        delete ret._id
      }
    }
  }
)

postsSchema.methods = {
  view(full) {
    const view = {}
    let fields = ['id', 'title']

    if (full) {
      fields = [...fields, 'createdBy']
    }

    fields.forEach((field) => {
      view[field] = this[field]
    })
    return view
  }
}

const model = mongoose.model('Posts', postsSchema)

export const schema = model.schema
export default model
