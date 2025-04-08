import { useQuery, useMutation } from "@apollo/client";
import { GET_MESSAGES, SEND_MESSAGE } from "@/graphql/messages";

type Message = {
  id: string;
  sender: string;
  text: string;
  time: string;
  date: string;
};

type GetMessagesResult = {
  messages: Message[];
};

export function useMessages(chatId: string) {
  const { data, loading } = useQuery<GetMessagesResult>(GET_MESSAGES, {
    variables: { chatId },
  });

  const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
    update(cache, { data }) {
      if (!data?.sendMessage) return;

      const newMessage = data.sendMessage;

      const existing = cache.readQuery<GetMessagesResult>({
        query: GET_MESSAGES,
        variables: { chatId },
      });

      if (!existing) return;

      cache.writeQuery<GetMessagesResult>({
        query: GET_MESSAGES,
        variables: { chatId },
        data: {
          messages: [...existing.messages, newMessage],
        },
      });
    },
  });

  const sendMessage = (text: string, sender: string) =>
    sendMessageMutation({
      variables: { chatId, sender, text },
    });

  return {
    messages: data?.messages ?? [],
    loading,
    sendMessage,
  };
}
