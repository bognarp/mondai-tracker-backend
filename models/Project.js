const { Schema, model } = require('mongoose');
const Story = require('./Story');
const User = require('./User');

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minLength: [4, 'Title is too short (must be more than 4 characters)'],
      maxLength: [60, 'Title is too long (must be less than 60 characters)'],
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
    
    this.members.forEach((member) => {
      User.removeMemberProjectFromUser(member, this._id);
    });
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
