import { gql } from "graphql-tag";

export const usersTypeDefs = gql`

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    phone: String!
    role: Role!
    transactions: [Transaction!]!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!, phone: String!, roleId: Int!): User!
    updateUser(id: ID!, name: String, email: String, password: String, phone: String, roleId: Int): User!
    deleteUser(id: ID!): User!
  }

`;
