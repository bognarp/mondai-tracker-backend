const { Schema, model } = require('mongoose');

const inviteSchema = new Schema({
  project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
  sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    name: String,
    ownProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    memberProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    invites: [inviteSchema],
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
