import React from "react";
import { gql, useQuery } from "@apollo/client";

import Loading from "../../Loading";
import ErrorMessage from "../../Error";
import IssueItem from "../IssueItem";

import './style.css';


const GET_ISSUES_OF_REPOSITORY = gql`
    query($repositoryOwner: String!, $repositoryName: String!){
        repository(name: $repositoryName, owner: $repositoryOwner){
            issues(first: 5){
                edges {
                    node {
                        id
                        number
                        state
                        title
                        url
                        bodyHTML
                    }
                }
            }
        }
    }
`

const Issues = ({repositoryOwner, repositoryName}) => {
    const {loading, error, data} = useQuery(GET_ISSUES_OF_REPOSITORY, {
        variables: {repositoryOwner, repositoryName}
    })
    console.log(loading, error, data)

    if(loading) return <Loading />
    if(error) return <ErrorMessage error={error} />
    
    const {repository} = data
    console.log(repository);

    if(!repository.issues.edges.length){
        return <div className="IssueList">No issues ...</div>;
    }

    return (
        <div className="Issues">
            <IssueList issues={repository.issues} />
        </div>
    )
};

const IssueList = ({issues}) => (
    <div className="IssueList">
        {issues.edges.map(() => (
            <IssueItem key={node.id} issue={node} />
        ))}
    </div>
)

export default Issues;