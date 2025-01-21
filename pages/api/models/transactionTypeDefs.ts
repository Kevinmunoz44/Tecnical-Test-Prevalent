import { gql } from "graphql-tag";

export const transactionTypeDefs = gql`

  type Transaction {
    id: ID!
    concept: String!
    amount: Float!
    date: String!
    transactionType: String!
    user: User!
  }

  type Query {
    transactions: [Transaction!]!
    transaction(id: ID!): Transaction
  }

  type Mutation {
    createTransaction(concept: String!, amount: Float!, transactionType: String!, userId: Int!): Transaction!
    updateTransaction(id: ID!, concept: String, amount: Float, transactionType: String): Transaction!
    deleteTransaction(id: ID!): Transaction!
  }

`;
