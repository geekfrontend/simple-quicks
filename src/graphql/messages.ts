import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query Messages($chatId: ID!) {
    messages(chatId: $chatId) {
      id
      sender
      text
      time
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: ID!, $sender: String!, $text: String!) {
    sendMessage(chatId: $chatId, sender: $sender, text: $text) {
      id
      sender
      text
      time
    }
  }
`;

export const MESSAGE_ADDED = gql`
  subscription MessageAdded($chatId: ID!) {
    messageAdded(chatId: $chatId) {
      id
      sender
      text
      time
    }
  }
`;
