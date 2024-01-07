"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const context_1 = require("../../context");
const server_1 = require("../server");
let mockCtx;
let ctx;
beforeEach(() => {
    mockCtx = (0, context_1.createMockContext)();
    ctx = mockCtx;
});
afterAll(async () => {
    await server_1.server.stop();
});
// Mock data
const mockUsers = [
    {
        id: 1,
        firstName: "Stephen",
        lastName: "Smith",
        phoneNumber: "+13105553706",
    },
    {
        id: 3,
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+13105553756",
    },
    {
        id: 4,
        firstName: "Amy",
        lastName: "Appleseed",
        phoneNumber: "+13105553757",
    },
    {
        id: 5,
        firstName: "Jamie",
        lastName: "Jellybean",
        phoneNumber: "+13105553758",
    },
];
const mockFriendships = [
    {
        id: 1,
        userId: 1,
        friendId: 2,
    },
    {
        id: 2,
        userId: 3,
        friendId: 4,
    },
];
const status = client_1.RequestStatus;
const mockFriendrequests = [
    {
        id: 1,
        senderId: 1,
        receiverId: 3,
        status: status.PENDING,
    },
];
describe('Query and Mutations tests', () => {
    it('fetches users', async () => {
        mockCtx.prisma.user.create.mockResolvedValue(mockUsers[0]);
        await expect(server_1.resolvers.Mutation.createUser(null, mockUsers[0], ctx)).resolves.toEqual({
            id: 1,
            firstName: 'Stephen',
            lastName: "Smith",
            phoneNumber: "+13105553706",
        });
    });
    it('fetches user by phone number', async () => {
        const phoneNumberToTest = "+13105553706"; // Stephen's phone number
        // Mock the response for findUnique on the user model
        mockCtx.prisma.user.findUnique.mockResolvedValue(mockUsers[0]);
        // Call the resolver
        const result = await server_1.resolvers.Query.userByPhoneNumber(null, { phoneNumber: phoneNumberToTest }, ctx);
        // Assertions
        expect(result).toEqual(mockUsers[0]);
        expect(mockCtx.prisma.user.findUnique).toHaveBeenCalledWith({
            where: { phoneNumber: phoneNumberToTest },
        });
    });
    it('fetches all friendships', async () => {
        // Mock the response for findMany on the user model
        mockCtx.prisma.friendship.findMany.mockResolvedValue(mockFriendships);
        // Call the resolver
        const result = await server_1.resolvers.Query.friendships(null, {}, ctx);
        // Assertions
        expect(result).toEqual(mockFriendships);
        expect(mockCtx.prisma.friendship.findMany).toHaveBeenCalledWith({
            include: {
                friend: true,
                user: true,
            }
        });
    });
    it('fetches all friend requests', async () => {
        // Mock the response for findMany on the user model
        mockCtx.prisma.friendRequest.findMany.mockResolvedValue(mockFriendrequests);
        // Call the resolver
        const result = await server_1.resolvers.Query.friendRequests(null, {}, ctx);
        // Assertions
        expect(result).toEqual(mockFriendrequests);
        expect(mockCtx.prisma.friendRequest.findMany).toHaveBeenCalledWith({
            include: {
                sender: true,
                receiver: true,
            }
        });
    });
});
