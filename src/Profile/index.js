import React from "react";
import {gql, useQuery} from '@apollo/client'
//import {graphql} from '@apollo/client/react/hoc'

import RepositoryList, {REPOSITORY_FRAGMENT} from '../Repository'

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
                        ...repository
                    }
                }
            }
        }
    }

    ${REPOSITORY_FRAGMENT}
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