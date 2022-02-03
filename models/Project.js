const { Schema, model } = require('mongoose');

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    owners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Project = model('Project', ProjectSchema);

module.exports = Project;
