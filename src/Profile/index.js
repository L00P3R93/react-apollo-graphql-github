import React from "react";
import {gql, useQuery} from '@apollo/client'
//import {graphql} from '@apollo/client/react/hoc'

import RepositoryList, {REPOSITORY_FRAGMENT} from '../Repository'

import Loading from '../Loading'
import ErrorMessage from "../Error";

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
    query($cursor: String) {
        viewer {
            repositories(
                first: 5 
                orderBy: {direction: DESC, field: STARGAZERS}
                after: $cursor
            ){
                edges {
                    node {
                        ...repository
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }

    ${REPOSITORY_FRAGMENT}
`;

const Profile = () => {
    const {loading, error, data, fetchMore} = useQuery(GET_REPOSITORIES_OF_CURRENT_USER, {
        notifyOnNetworkStatusChange: true
    })
    console.log(loading, error, data)

    if(loading) return <Loading />
    if(error) return <ErrorMessage error={error} />
    
    const {viewer} = data
    console.log(viewer);
    return <RepositoryList 
                loading={loading}
                repositories={viewer.repositories} 
                fetchMore={fetchMore}/>
}

export default Profile;