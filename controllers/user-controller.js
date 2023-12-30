const { User, Thought } = require("../models");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate("thoughts")
        .populate("friends"); //populate thoughts and friends

      if (!user) {
        return res.status(404).json({ message: "No user found!! dingbat" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //update a single user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user found!! dingbat" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json(error);
      console.error(error);
    }
  },
  //delete a single user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "No user found!! dingbat" });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } }); //deletes thoughts associated with user when user is deleted

      res.json({ message: "User successfully deleted!!" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //add a friend
  async addFriend(req, res) {
    const { friendId } = req.body;
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: friendId } },
        { new: true }
      ).populate("friends");

      if (!user) {
        return res.status(400).json({ message: "No user found!! dingbat" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //remove a friend
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      ).populate("friends");

      if (!user) {
        return res.status(400).json({ message: "No user found!! dingbat" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
