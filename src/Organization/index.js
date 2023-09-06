import React from "react";
import { gql, useQuery } from "@apollo/client";

import RepositoryList,{ REPOSITORY_FRAGMENT } from "../Repository";
import Loading from "../Loading";
import ErrorMessage from "../Error";

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
    query($organizationName: String!, $cursor: String){
        organization(login: $organizationName){
            repositories(first: 5, after: $cursor){
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

const Organization = ({ organizationName }) => {
    //let skipQuery = (organizationName === '')? true: false;
    const {loading, error, data, fetchMore} = useQuery(GET_REPOSITORIES_OF_ORGANIZATION, {
        variables: {organizationName},
        notifyOnNetworkStatusChange: true,
    })

    console.log(loading, error, data)

    if(loading) return <Loading />
    if(error) return <ErrorMessage error={error} />
    
    const {organization} = data
    console.log(organization);

    return <RepositoryList 
                loading={loading}
                repositories={organization.repositories}
                fetchMore={fetchMore}
                entry={'organization'}/>
}

export default Organization