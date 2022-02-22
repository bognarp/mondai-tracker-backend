const { Schema, model } = require('mongoose');

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    owners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
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
