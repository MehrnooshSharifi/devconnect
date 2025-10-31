import { gql } from "graphql-request";

export const MY_POSTS_QUERY = gql`
  query MyPosts {
    myPosts {
      id
      title
      content
      published
      createdAt
    }
  }
`;
