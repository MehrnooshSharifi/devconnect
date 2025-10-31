import { gql } from "graphql-request";

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
      published
      createdAt
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($id: Int!, $title: String!, $content: String!) {
    updatePost(id: $id, title: $title, content: $content) {
      id
      title
      content
      published
      createdAt
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id) {
      id
    }
  }
`;
