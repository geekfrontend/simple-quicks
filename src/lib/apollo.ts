import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { config } from "@/config";

const httpLink = new HttpLink({
  uri: `${config.BASE_URL_GRAPHQL}`,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
