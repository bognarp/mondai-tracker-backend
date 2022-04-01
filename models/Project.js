const { Schema, model } = require('mongoose');
const Story = require('./Story');

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: String,
    avatar: {
      type: String,
      default: 'default',
    },
    owners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

projectSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function () {
    await Story.deleteMany({ project: this._id });
  }
);

projectSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    delete returnedObj.__v;
  },
});

projectSchema.statics.deleteById = function (_id) {
  return this.deleteOne({ _id });
};

const Project = model('Project', projectSchema);

module.exports = Project;
