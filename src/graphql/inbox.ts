import { gql } from "@apollo/client";

export const GET_INBOX_LIST = gql`
  query InboxList {
    inboxList {
      id
      subject
      preview
      sender
      date
      isGroup
      isUnread
    }
  }
`;

export const GET_INBOX_ITEM = gql`
  query InboxItem($id: ID!) {
    inboxItem(id: $id) {
      id
      subject
      preview
      sender
      date
      isGroup
      isUnread
    }
  }
`;
