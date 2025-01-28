import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
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
