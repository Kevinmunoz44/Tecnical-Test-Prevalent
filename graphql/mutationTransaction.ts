import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction(
    $concept: String!
    $amount: Float!
    $date: String!
    $transactionType: String!
    $userId: Int!
  ) {
    createTransaction(
      concept: $concept
      amount: $amount
      date: $date
      transactionType: $transactionType
      userId: $userId
    ) {
      id
      concept
      amount
      date
      transactionType
      user {
        id
        name
      }
    }
  }
`;
