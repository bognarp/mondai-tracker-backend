const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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

userSchema.methods.isProjectOwner = function (projectId) {
  return this.ownProjects.some((pId) => pId.equals(projectId));
};

userSchema.methods.isProjectMember = function (projectId) {
  return this.memberProjects.some((pId) => pId.equals(projectId));
};

const User = model('User', userSchema);

module.exports = User;
