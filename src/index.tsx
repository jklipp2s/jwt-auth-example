import React from 'react';
import { ApolloProvider } from '@apollo/client';
import ReactDOM from 'react-dom';
import { ApolloProvider as ApolloHooksProvider, HttpLink } from '@apollo/react-hooks';
import { getAccessToken, setAccessToken } from './accessToken';
import { App } from './App';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';



import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable
} from '@apollo/client'







const requestLink = new ApolloLink(
  (operation, forward) => new Observable(observer => {
    let handle: any;
    Promise.resolve(operation)
    .then(() =>
      {
        const accessToken = getAccessToken();
        operation.setContext({
          headers: {
          authorization: accessToken ? `Bearer ${ accessToken }` : "",
        }
      });
      
      })
    .then(() => {
      handle = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer)
      });
    })
    .catch(observer.error.bind(observer));
   
    return () => {
      if (handle) handle.unsubscribe();
    }
  })
)  



const cache = new InMemoryCache();



const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: () => {
        const token = getAccessToken();

        if (!token) {
          return true;
        }

        try {
          const { exp } = jwtDecode(token);
          if (Date.now() >= exp * 1000) {
            return false;
          } else {
            return true;
          }
        } catch {
          return false;
        }
      },
      fetchAccessToken: () => {
        return fetch("http://localhost:4000/refresh_token", {
          method: "POST",
          credentials: "include"
        });
      },
      handleFetch: accessToken => {
        setAccessToken(accessToken);
      },
      handleError: err => {
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
      }
    }),
    
    requestLink,
    new HttpLink({
      uri: "http://localhost:4000/graphql",
      credentials: "include"
    })
  ]),
  cache
});






ReactDOM.render(
  <ApolloProvider client={client}>
  <ApolloHooksProvider client={client}>
    <App />
  </ApolloHooksProvider>
</ApolloProvider>,
  document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

