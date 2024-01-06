const { Thought, User } = require("../models");

module.exports = {
  //get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: "No thought found!! dingbat" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //post to create a new thought, push the thought's _id to the user thoughts array
  async createThought(req, res) {
    try {
      const { username } = req.body;
      const newThought = await Thought.create(req.body);

      await User.findOneAndUpdate(
        { username },
        { $push: { thoughts: newThought._id } },
        { new: true }
      );

      res.json(newThought);
    } catch (error) {
      res.status(500).json(error);
      console.error(error);
    }
  },
  //put to update a thought by it's _id
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought found!! dingbat" });
      }

      res.json(thought);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //delete to remove a thought by it's _id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res.status(404).json({ message: "No thought found!! dingbat" });
      }

      res.json({ message: "Thought successfully deleted!!" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //create a new reaction
  async createReaction(req, res) {
    try {
      const reaction = {
        reactionBody: req.body.reactionBody,
        username: req.body.username,
      };
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        return res.status(404).json({ message: "No thought found!! dingbat" });
      }

      thought.reactions.push(reaction);

      const updateThought = await thought.save();
      res.json(updateThought);
    } catch (error) {
      res.status(500).json(error);
      console.error(error);
    }
  },
  //delete a reaction
  async deleteReaction(req, res) {
    try {
      const { thoughtId } = req.params;
      const { reactionId } = req.body;

      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ message: "No thought found!! dingbat" });
      }

      thought.reactions.pull(reactionId);

      const updateThought = await thought.save();

      res.json(updateThought);
    } catch (error) {
      res.status(500).json(error);
      console.error(error);
    }
  },
};
