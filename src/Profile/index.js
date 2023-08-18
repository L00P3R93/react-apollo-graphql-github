import React from "react";
import {gql, useQuery} from '@apollo/client'

import RepositoryList from '../Repository'

import Loading from '../Loading'
import ErrorMessage from "../Error";

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
    query {
        viewer {
            repositories(
                first: 5 
                orderBy: {direction: DESC, field: STARGAZERS}
            ){
                edges {
                    node {
                        id
                        name
                        url
                        descriptionHTML
                        primaryLanguage {name}
                        owner {
                            login
                            url
                        }
                        stargazers{
                            totalCount
                        }
                        viewerHasStarred
                        watchers {
                            totalCount
                        }
                        viewerSubscription
                    }
                }
            }
        }
    }
`;

const Profile = () => {
    const {loading, error, data} = useQuery(GET_REPOSITORIES_OF_CURRENT_USER)
    console.log(loading, error, data)

    if(loading) return <Loading />
    if(error) return <ErrorMessage error={error} />
    
    const {viewer} = data
    console.log(viewer);
    return <RepositoryList repositories={viewer.repositories} />
}

export default Profile;