const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
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

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // the passwordHash should not be revealed
    delete returnedObject.password;
  },
});

const User = model('User', UserSchema);

module.exports = User;
