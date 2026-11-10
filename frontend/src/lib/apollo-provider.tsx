'use client';

import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ReactNode, useMemo } from 'react';

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

export function ApolloProviderWrapper({ children }: ApolloProviderWrapperProps) {
  const client = useMemo(() => {
    // HTTP link to GraphQL endpoint
    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5000/graphql',
    });

    // Auth link removed - no authentication required
    const authLink = setContext((_, { headers }) => {
      // Return headers without authentication
      return {
        headers: {
          ...headers,
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
    });
  }, []);

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
