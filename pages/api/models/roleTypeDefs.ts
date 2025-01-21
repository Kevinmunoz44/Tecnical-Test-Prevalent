import { gql } from "graphql-tag";

export const rolesTypeDefs = gql`

  type Role {
    id: ID!
    name: String!
    users: [User!]! 
  }

  type Query {
    roles: [Role!]!
    role(id: ID!): Role
  }

  type Mutation {
    createRole(name: String!): Role!
    updateRole(id: ID!, name: String!): Role!
    deleteRole(id: ID!): Role!
  }

`