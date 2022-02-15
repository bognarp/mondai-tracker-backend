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
    delete returnedObject.password;
    delete returnedObject.__v;
  },
});

userSchema.methods.isProjectOwner = function (project) {
  return this.ownProjects.some((pId) => project.equals(pId));
};

userSchema.methods.isProjectMember = function (project) {
  return this.memberProjects.some((pId) => project.equals(pId));
};

const User = model('User', userSchema);

module.exports = User;
