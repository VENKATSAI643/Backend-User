const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    bio: String
    avatar: String
    isPrivate: Boolean
    followers: [User]
    following: [User]
  }

  type Query {
    getUser(id: ID!): User
    getFollowers(id: ID!): [User]
    getFollowing(id: ID!): [User]
  }

  type Mutation {
    editProfile(id: ID!, bio: String, avatar: String, isPrivate: Boolean): User
    followUser(userId: ID!, followId: ID!): User
    unfollowUser(userId: ID!, unfollowId: ID!): User
    removeFollower(userId: ID!, followerId: ID!): User
  }
`;

module.exports = typeDefs;
