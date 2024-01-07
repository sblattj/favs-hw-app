"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const singleton_1 = require("../../singleton");
describe('Query', () => {
    it('fetches users', async () => {
        // Mock data to return when the PrismaClient's findMany is called
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
        singleton_1.prismaMock.user.create.mockResolvedValue(mockUsers[0]);
    });
});
