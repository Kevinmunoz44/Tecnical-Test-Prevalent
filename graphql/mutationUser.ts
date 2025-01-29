import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    user {
      id
      name
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $name: String!, $phone: String!, $roleId: Int!) {
    updateUser(id: $id, name: $name, phone: $phone, roleId: $roleId) {
      id
      name
      phone
      role {
        id
        name
      }
    }
  }
`;
