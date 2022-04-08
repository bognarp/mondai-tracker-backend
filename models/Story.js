const { Schema, model } = require('mongoose');

const storySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minLength: [4, 'Title is too short (must be more than 4 characters)'],
      maxLength: [60, 'Title is too long (must be less than 60 characters)'],
      trim: true,
    },
    description: String,
    state: {
      type: String,
      enum: [
        'UNSCHEDULED',
        'UNSTARTED',
        'STARTED',
        'RESTARTED',
        'FINISHED',
        'REJECTED',
        'ACCEPTED',
      ],
      required: true,
      default: 'UNSCHEDULED',
    },
    difficulty: {
      type: Number,
      min: [0, "Difficulty can't be negative"],
      max: [4, "Difficulty can't be more than 4"],
      default: 0,
    },
    priority: {
      type: Number,
      min: [0, "Priority can't be negative"],
      max: [4, "Priority can't be more than 4"],
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
  },
  { timestamps: true, toObject: { virtuals: true } }
);

storySchema.set('id', false);

storySchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    delete returnedObj.__v;
  },
  virtuals: true,
});

storySchema.virtual('stateCategory').get(function () {
  switch (this.state) {
    case 'UNSTARTED':
    case 'STARTED':
    case 'REJECTED':
    case 'FINISHED':
    case 'RESTARTED':
      return 'CURRENT';
    case 'UNSCHEDULED':
      return 'BACKLOG';
    case 'ACCEPTED':
      return 'DONE';
    default:
      return null;
  }
});

storySchema.statics.deleteById = function (_id) {
  return this.deleteOne({ _id });
};

const Story = model('Story', storySchema);

module.exports = Story;
