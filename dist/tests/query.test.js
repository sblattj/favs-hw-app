"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const server_1 = require("../server");
const jest_mock_extended_1 = require("jest-mock-extended");
const client_1 = require("@prisma/client");
jest.mock('@prisma/client', () => ({
    PrismaClient: (0, jest_mock_extended_1.mockDeep)(),
}));
let prismaMock;
let server;
beforeAll(() => {
    prismaMock = new client_1.PrismaClient();
    server = new apollo_server_1.ApolloServer({
        typeDefs: server_1.typeDefs,
        resolvers: server_1.resolvers,
        context: () => ({ prisma: prismaMock }),
    });
});
beforeEach(() => {
    (0, jest_mock_extended_1.mockReset)(prismaMock);
});
describe('Query', () => {
    it('fetches friendships', async () => {
    });
});
