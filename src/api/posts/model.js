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
    const view = {
      // simple view
      id: this.id,
      createdBy: this.createdBy.view(full),
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full
      ? {
          ...view
          // add properties for a full view
        }
      : view
  }
}

const model = mongoose.model('Posts', postsSchema)

export const schema = model.schema
export default model
