"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.resolvers = exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
const client_1 = __importDefault(require("./client"));
// GraphQL schema definition
exports.typeDefs = (0, apollo_server_1.gql) `
type User {
  id: ID!
  firstName: String!
  lastName: String!
  phoneNumber: String!
  sentRequests: [FriendRequest!]!
  receivedRequests: [FriendRequest!]!
  friends: [User!]!
}

type FriendRequest {
  id: ID!
  sender: User!
  receiver: User!
  status: RequestStatus!
}

type Friendship {
  id: ID!
  user: User!
  friend: User!
}

enum RequestStatus {
  PENDING
  ACCEPTED
  REJECTED
}

type Query {
  friendRequests: [FriendRequest!]!
  friendships: [Friendship!]!
  userByPhoneNumber(phoneNumber: String!): User
  userFriends(userId: ID!): [User!]!
  users: [User!]!
}

type Mutation {
  confirmFriendRequest(requestId: ID!): Friendship!
  createUser(firstName: String!, lastName: String!, phoneNumber: String!): User!
  rejectFriendRequest(requestId: ID!): FriendRequest!
  sendFriendRequest(senderId: ID!, receiverId: ID!): FriendRequest!
}
`;
exports.resolvers = {
    Query: {
        friendships: async (parent, args, context) => {
            return context.prisma.friendship.findMany({
                include: {
                    friend: true,
                    user: true,
                }
            });
        },
        friendRequests: async (parent, args, context) => {
            return context.prisma.friendRequest.findMany({
                include: {
                    sender: true,
                    receiver: true,
                }
            });
        },
        userByPhoneNumber: async (parent, args, context) => {
            return context.prisma.user.findUnique({
                where: { phoneNumber: args.phoneNumber },
            });
        },
        userFriends: async (parent, args, context) => {
            const userId = parseInt(args.userId);
            // Fetch friendships where the user is either the user or the friend
            const friendships = await context.prisma.friendship.findMany({
                where: {
                    OR: [
                        { userId: userId },
                        { friendId: userId }
                    ]
                },
                include: {
                    user: true,
                    friend: true
                }
            });
            // Extract and return the friends
            const friends = friendships.map(friendship => {
                return (friendship.userId === userId) ? friendship.friend : friendship.user;
            });
            return friends;
        },
        users: async (parent, args, context) => {
            return context.prisma.user.findMany();
        },
    },
    Mutation: {
        confirmFriendRequest: async (parent, args, context) => {
            // Retrieve the friend request based on the provided requestId
            const existingRequest = await context.prisma.friendRequest.findUnique({
                where: { id: parseInt(args.requestId) },
            });
            // Check if the friend request exists and its status is PENDING
            if (!existingRequest) {
                throw new Error('Friend request not found.');
            }
            if (existingRequest.status !== 'PENDING') {
                throw new Error('This friend request cannot be confirmed as it is not in a PENDING status.');
            }
            const updatedRequest = await context.prisma.friendRequest.update({
                where: { id: parseInt(args.requestId) },
                data: { status: 'ACCEPTED' },
            });
            // Create a new friendship
            const friendship = await context.prisma.friendship.create({
                data: {
                    userId: updatedRequest.senderId,
                    friendId: updatedRequest.receiverId,
                },
                include: {
                    user: true,
                    friend: true,
                }
            });
            return friendship;
        },
        createUser: async (parent, args, context) => {
            // Check if a user with the same phone number already exists
            const existingUser = await context.prisma.user.findUnique({
                where: {
                    phoneNumber: args.phoneNumber,
                },
            });
            // If a user with the phone number exists, throw an error
            if (existingUser) {
                throw new Error('A user with this phone number already exists.');
            }
            return context.prisma.user.create({
                data: {
                    firstName: args.firstName,
                    lastName: args.lastName,
                    phoneNumber: args.phoneNumber,
                },
            });
        },
        rejectFriendRequest: async (parent, args, context) => {
            const requestId = parseInt(args.requestId);
            const existingRequest = await context.prisma.friendRequest.findUnique({
                where: { id: requestId }
            });
            if (!existingRequest) {
                throw new Error('Friend request not found.');
            }
            if (existingRequest.status === 'REJECTED') {
                throw new Error('This friend request has already been rejected.');
            }
            if (existingRequest.status !== 'PENDING') {
                throw new Error('This friend request cannot be rejected.');
            }
            const updatedRequest = await context.prisma.friendRequest.update({
                where: { id: parseInt(args.requestId) },
                data: { status: 'REJECTED' },
            });
            return updatedRequest;
        },
        sendFriendRequest: async (parent, args, context) => {
            // Convert IDs from string to number
            const senderId = parseInt(args.senderId);
            const receiverId = parseInt(args.receiverId);
            // Check if the users are already friends
            const existingFriendship = await context.prisma.friendship.findFirst({
                where: {
                    OR: [
                        { userId: senderId, friendId: receiverId },
                        { userId: receiverId, friendId: senderId }
                    ]
                }
            });
            if (existingFriendship) {
                throw new Error('Users are already friends.');
            }
            // Check if a friend request already exists and is either pending or accepted
            const existingRequest = await context.prisma.friendRequest.findFirst({
                where: {
                    OR: [
                        { senderId: senderId, receiverId: receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ],
                    status: { in: ['PENDING', 'ACCEPTED'] }
                }
            });
            if (existingRequest) {
                throw new Error('A friend request already exists or has been accepted.');
            }
            // Check if a friend request was previously rejected
            const rejectedRequest = await context.prisma.friendRequest.findFirst({
                where: {
                    senderId: senderId,
                    receiverId: receiverId,
                    status: 'REJECTED'
                }
            });
            if (rejectedRequest) {
                throw new Error('A previous friend request was rejected.');
            }
            // Create and return the new friend request
            return context.prisma.friendRequest.create({
                data: {
                    senderId: senderId,
                    receiverId: receiverId,
                    status: 'PENDING',
                },
            });
        }
    },
};
exports.server = new apollo_server_1.ApolloServer({
    typeDefs: exports.typeDefs,
    resolvers: exports.resolvers,
    context: () => {
        return {
            prisma: client_1.default,
        };
    }
});
exports.server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
