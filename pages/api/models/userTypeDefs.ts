import { gql } from "graphql-tag";

export const usersTypeDefs = gql`

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    phone: String!
    amount: Float!
    role: Role!
    transactions: [Transaction!]!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, phone: String!, password: String!, roleId: Int!, amount: Float!): User!
    updateUser(id: Int!, name: String, email: String, phone: String, password: String, roleId: Int, amount: Float): User!
    deleteUser(id: Int!): User!
  }

`;
