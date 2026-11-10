import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Function to create Apollo Client (for SSR compatibility)
function createApolloClient() {
  // HTTP link to GraphQL endpoint
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5000/graphql',
  });

  // Auth link to add JWT token to requests
  const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('auth_token') || '';
    }

    // Return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      }
    };
  });

  // Error link to handle GraphQL and network errors
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);

      // Authentication error handling removed
    }
  });

  // Create Apollo Client instance
  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          keyFields: ['_id'],
        },
        QuizResult: {
          keyFields: ['_id'],
        },
        ProfileDetails: {
          keyFields: ['_id'],
        },
        CareerGuidance: {
          keyFields: ['_id'],
        },
        CodingChallenge: {
          keyFields: ['_id'],
        },
        UserSolution: {
          keyFields: ['_id'],
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
    },
    ssrMode: typeof window === 'undefined',
  });
}

// Create a single instance for client-side
let apolloClient: ApolloClient<any> | null = null;

function getApolloClient() {
  // For SSR, always create a new client
  if (typeof window === 'undefined') {
    return createApolloClient();
  }

  // For client-side, create the client once and reuse it
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }

  return apolloClient;
}

export default getApolloClient();
