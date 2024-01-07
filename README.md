## Setup Instructions
- clone repo
- npm install
- npm build
- add DATABASE_URL to .env file
- npm start

Navigate to http://localhost:4000 to enter query playground.

## Implementation Details
I have placed the main application code underneath an src directory.

I separated the client and server into two different files for later customization.

If the resolvers and / or typedefs got any larger, I might also separate those out into separate files.

I prefer more files with less code, as opposed to the reverse.

I created a schema in Prisma with relations and constraints supporting the requirements.

There are 3 models in this schema, User, FriendRequest, and Friendship.

A user has basic user details, a friend request has a status, sender, and receiver, and a friendship consists of a user and that user's friend.

The constraints assured uniqueness of specific data.

One constraint added directly into the schema was bidirectional uniqueness of friendships. This ensured that if user A was friends with user B, user B could not also be friends with user A.

I added test cases with jest.

## Additional Testing
I added testing for the following cases
- creating a user
- fetching all friendships
- fetching all friend requests
- fetching users by phone number

If I had more time, I would test the following cases:
- fetching a user's friends
- fetching all users
- confirming a friend request
- confirming a friend request when there is no request found
- confirming a friend request when the status of that request is not PENDING
- rejecting a friend request
- rejecting a friend request when there is no request found
- rejecting a friend request when the request has already been rejected
- rejecting a friend request that has been accepted
- sending a friend request
- sending a friend request to a user that is already a friend
- sending a friend request to a user that already has one pending or accepted
- sending a friend request to a user that has already been rejected

## Original Assignment Below

## Your Fav Homework Assignment

#### Background
Favs is a unique social network that emphasizes minimalism and enriches real interactions and relationships with friends. Our platform is designed to streamline and enhance the user experience by focusing on meaningful connections.

#### Position
Backend Software Engineer

#### Technologies
- Language: TypeScript
- Frameworks: Node.js
- Database: PostgreSQL
- ORM: Prisma
- API: GraphQL

#### Task Overview
Your task is to create a "simplified" version of Favs that fulfills the requirements listed below. The application should be built using TypeScript, GraphQL, Prisma, and PostgreSQL.

#### Requirements

1. **Schema Design:**
   - **Users:** The schema should include a user model with the following attributes:
     - First name
     - Last name
     - Phone number
   - **Friendships:** Implement a system where users can establish friendships with other users.
   - **Friend Requests:** Users should be able to send friend requests to others, which can either be accepted or rejected, leading to the formation of a friendship.

2. **GraphQL API:**
   - Develop a GraphQL API to support the following functionalities:
     - **User Management:** Creating new users and retrieving user details.
     - **Friend Requests:** Sending, accepting, and rejecting friend requests.
     - **Friend List Retrieval:** Ability to fetch a list of friends for a given user.

#### Guidelines
- Feel free to use any additional libraries or frameworks that are compatible with the specified technologies.
- While designing the schema and API, keep best practices in mind.
- Focus on writing clean and extensible code. Just because the problem is scoped down doesn't mean that a hacky solution is acceptable.
- While you can spend as much time as you want on this assignment, we expect it to take approximately 2-3 hours to complete.

#### Non-Requirements
- Authentication and authorization. Feel free to hardcode the user ID wherever/however you see fit.
- User interface. GraphiQL is sufficient for testing the API.

#### Deliverables
- Upload your code to a public GitHub repository and send us the link.
- Documentation explaining your design decisions and how to set up and run the application.
- Any tests you have written for the application.

#### Evaluation Criteria
- Adherence to the specified technologies and the task requirements.
- Quality of the code (including readability, structure, and adherence to best practices).
- Functionality of the implemented features.
- Thoughtfulness in the design.

Good luck! Don't hesitate to reach out if you have any questions along the way.