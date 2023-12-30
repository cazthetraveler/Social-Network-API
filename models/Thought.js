const { Schema, Types, model } = require("mongoose");

const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxLength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: function (timestamp) {
      return formatDate(timestamp);
    },
  },
});

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now, //use getter method to format date
      get: function (timestamp) {
        return formatDate(timestamp);
      },
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true, //maybe add getters??
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

function formatDate(date) {
  return date.toLocaleString("en-us", { timeZone: "UTC" });
}

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
