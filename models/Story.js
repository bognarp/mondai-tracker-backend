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
  { timestamps: true }
);

storySchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    delete returnedObj.__v;
  },
});

const Story = model('Story', storySchema);

module.exports = Story;
