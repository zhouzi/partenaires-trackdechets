import axios from "axios";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const trackdechets = new ApolloClient({
  uri: "https://api.trackdechets.beta.gouv.fr",
  cache: new InMemoryCache(),
});

export const client = axios.create({
  baseURL: "/api",
});
