const User = require('../models/User');
const mongoose = require('mongoose');
const { Types } = mongoose; // Import Types from mongoose

const userResolvers = {
  Query: {
    getUser: async (_, { id }) => {
      return await User.findById(id).populate('followers following');
    },
    getFollowers: async (_, { id }) => {
      const user = await User.findById(id).populate('followers');
      return user ? user.followers : [];
    },
    getFollowing: async (_, { id }) => {
      const user = await User.findById(id).populate('following');
      return user ? user.following : [];
    }
  },

  Mutation: {
    editProfile: async (_, { id, bio, avatar }) => {
        try {
          console.log(`Editing profile for user: ${id}`);
      
          // Since your _id is a string, we don't need to use Types.ObjectId
          const updatedUser = await User.findByIdAndUpdate(
            id,  // Using the id directly since it's a string
            { bio, avatar }, 
            { new: true }
          );
      
          if (!updatedUser) {
            throw new Error('User not found');
          }
      
          console.log('Updated user:', updatedUser);
          return updatedUser;
        } catch (error) {
          console.error('Error in editProfile:', error);
          throw new Error(`Failed to edit profile: ${error.message}`);
        }
      },      

      unfollowUser: async (_, { userId, unfollowId }) => {
        const user = await User.findById(userId);
        const unfollowUser = await User.findById(unfollowId);
      
        if (!user || !unfollowUser || !user.following.includes(unfollowId)) {
          throw new Error('Cannot unfollow user.');
        }
      
        // Remove unfollowId from following and userId from followers
        user.following = user.following.filter(id => id.toString() !== unfollowId);
        unfollowUser.followers = unfollowUser.followers.filter(id => id.toString() !== userId);
      
        // Save updated users
        await user.save();
        await unfollowUser.save();
      
        // Fetch actual user data for following list
        const followingUsers = await User.find({ _id: { $in: user.following } });
      
        // Return the user with their following and followers
        return {
          id: user._id.toString(), // Convert ObjectId to string
          username: user.username,
          following: followingUsers.map(followingUser => ({
            id: followingUser._id.toString(), // Convert ObjectId to string
            username: followingUser.username,
          })),
          followers: unfollowUser.followers.map(f => f.toString()), // Convert followers to string
        };
      },
      

    removeFollower: async (_, { userId, followerId }) => {
      const user = await User.findById(userId);
      const followerUser = await User.findById(followerId);

      if (!user || !followerUser || !user.followers.includes(followerId)) {
        throw new Error('Cannot remove follower.');
      }

      user.followers = user.followers.filter(id => id.toString() !== followerId);
      followerUser.following = followerUser.following.filter(id => id.toString() !== userId);

      await user.save();
      await followerUser.save();

      return user;
    },
    followUser : async (_, { userId, followId }) => {
        try {

            console.log('User ID:', userId);
            console.log('Follow ID:', followId);

          // Convert IDs to ObjectId types if needed
          const userObjectId = new mongoose.Types.ObjectId(userId);
          const followObjectId =new  mongoose.Types.ObjectId(followId);
      
          const user = await User.findById(userObjectId);
          const followUser = await User.findById(followObjectId);
      
          // Check if the users exist
          if (!user) throw new Error('User not found');
          if (!followUser) throw new Error('User to follow not found');
      
          // Check if already following
          if (user.following.includes(followObjectId)) {
            throw new Error('Already following this user');
          }
      
          // Add followId to the user's following list
          user.following.push(followObjectId);
      
          // Add userId to followUser's followers list
          followUser.followers.push(userObjectId);
      
          // Save both users
          await user.save();
          await followUser.save();
      
          // Populate the following and followers after the update
          await user.populate('following');
          await followUser.populate('followers');
      
          return user;  // Or return a more detailed response if needed
        } catch (error) {
          console.error('Error in followUser mutation:', error);
          throw new Error('Failed to follow user');
        }
    },
      
    },
};

module.exports = userResolvers;
