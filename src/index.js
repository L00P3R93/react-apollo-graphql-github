import React from 'react';
import ReactDOM from 'react-dom/client';

import {ApolloClient, InMemoryCache, ApolloProvider, gql} from '@apollo/client'

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const GITHUB_BASE_URL = 'https://api.github.com/graphql'

const client = new ApolloClient({
	uri: GITHUB_BASE_URL,
	cache: new InMemoryCache(),
	headers: {
		authorization: `Bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
	}
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
