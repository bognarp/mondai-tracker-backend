const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      index: true,
      required: true,
    },
    email: {
      type: String,
      index: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    ownProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    memberProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // the passwordHash should not be revealed
    delete returnedObject.password;
  },
});

userSchema.methods.isProjectOwner = function (project) {
  return this.ownProjects.some((pId) => project.equals(pId));
};

const User = model('User', userSchema);

module.exports = User;
