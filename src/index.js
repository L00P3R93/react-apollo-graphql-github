import React from 'react';
import ReactDOM from 'react-dom/client';

import {ApolloClient, ApolloLink, HttpLink, InMemoryCache, ApolloProvider} from '@apollo/client'
import {onError} from '@apollo/client/link/error'

import './style.css';
import App from './App';

import reportWebVitals from './reportWebVitals';

//console.log('sss')

const GITHUB_BASE_URL = 'https://api.github.com/graphql'

const errorLink = onError(({graphQLErrors, networkError}) => {
	if(graphQLErrors){

	}

	if(networkError){

	}
})

const httpLink = new HttpLink({
	uri: GITHUB_BASE_URL,
	headers: {
		authorization: `Bearer ${
			process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
		}`
	}
})

const link = new ApolloLink.from([errorLink, httpLink])


const cache = new InMemoryCache();

const client = new ApolloClient({
	cache,
	link
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
