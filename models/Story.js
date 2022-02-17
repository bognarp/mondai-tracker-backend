const { Schema, model } = require('mongoose');

const storySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
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

const Story = model('Story', storySchema);

module.exports = Story;
