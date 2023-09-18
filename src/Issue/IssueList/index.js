import React from "react";
import { useQuery, ApolloConsumer } from "@apollo/client";
import { withState } from "recompose";

import { GET_ISSUES_OF_REPOSITORY } from "./queries";
import Loading from "../../Loading";
import ErrorMessage from "../../Error";
import IssueItem from "../IssueItem";
import FetchMore from "../../FetchMore";
import {ButtonUnobtrusive} from '../../Button'

import './style.css';

const ISSUE_STATES = {
    NONE: "NONE",
    OPEN: "OPEN",
    CLOSED: "CLOSED"
};

const TRANSITION_LABELS = {
    [ISSUE_STATES.NONE]: "Show Open Issues",
    [ISSUE_STATES.OPEN]: "Show Closed Issues",
    [ISSUE_STATES.CLOSED]: "Hide Issues"
}

const TRANSITION_STATE = {
    [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
    [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
    [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE
}

const isShow = issueState => issueState !== ISSUE_STATES.NONE;


const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
        return previousResult;
    }

    return {
        ...previousResult,
        repository: {
            ...previousResult.repository,
            issues: {
                ...previousResult.repository.issues,
                ...fetchMoreResult.repository.issues,
                edges: [
                    ...previousResult.repository.issues.edges,
                    ...fetchMoreResult.repository.issues.edges
                ],
            },
        },
    };
};

/**
 * Fetches issues from a repository based on the provided parameters.
 *
 * @param {object} client - The GraphQL client.
 * @param {string} repositoryOwner - The owner of the repository.
 * @param {string} repositoryName - The name of the repository.
 * @param {string} issueState - The state of the issues to fetch.
 * @return {void}
 */
const prefetchIssues = (client, repositoryOwner, repositoryName, issueState) => {
    const nextIssueState = TRANSITION_STATE[issueState]

    if(isShow(nextIssueState)){
        client.query({
            query: GET_ISSUES_OF_REPOSITORY,
            variables: {
                repositoryOwner,
                repositoryName,
                issueState: nextIssueState
            }
        })
    }
}

/**
 * Renders a list of issues for a given repository.
 *
 * @param {string} repositoryOwner - The owner of the repository.
 * @param {string} repositoryName - The name of the repository.
 * @param {string} issueState - The state of the issues to display.
 * @param {Function} onChangeIssueState - A callback function to handle changing the issue state.
 * @return {JSX.Element} The rendered list of issues.
 */
const Issues = ({ repositoryOwner, repositoryName, issueState, onChangeIssueState }) => {
    console.log("issueState: ", issueState);
    const { loading, error, data, fetchMore } = useQuery(GET_ISSUES_OF_REPOSITORY, {
        variables: { repositoryOwner, repositoryName, issueState },
    });

    //console.log("Loading:", loading);
    //console.log("Error:", error);
    //console.log("Data:", data);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    const { repository } = data;
    //console.log("Repository:", repository);

    const filteredRepository = {
        issues: {
            edges: repository.issues.edges.filter(
                issue => issue.node.state === issueState
            )
        }
    }
    

    console.log("Filtered repository:", filteredRepository);

    if (!filteredRepository.issues.edges.length) {
        return <div className="IssueList">No issues ...</div>;
    }

    return (
        <div className="Issues">
            <IssueFilter 
                repositoryOwner={repositoryOwner}
                repositoryName={repositoryName}
                issueState={issueState}
                onChangeIssueState={onChangeIssueState}
            />
            {isShow(issueState) && <IssueList 
                                        issues={repository.issues}
                                        loading={loading}
                                        repositoryOwner={repositoryOwner}
                                        repositoryName={repositoryName}
                                        issueState={issueState}
                                        fetchMore={fetchMore}   
                                    />}
        </div>
    );
};

/**
 * Generates a function comment for the given function body.
 *
 * @param {Object} props - The props for the IssueFilter component.
 * @param {string} props.repositoryOwner - The owner of the repository.
 * @param {string} props.repositoryName - The name of the repository.
 * @param {string} props.issueState - The state of the issue.
 * @param {function} props.onChangeIssueState - The function to handle the change of issue state.
 * @return {JSX.Element} The IssueFilter component.
 */
const IssueFilter = ({ repositoryOwner, repositoryName, issueState, onChangeIssueState }) => (
    <ApolloConsumer>
        {client => (
            <ButtonUnobtrusive
                onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
                onMouseOver={prefetchIssues(
                    client,
                    repositoryOwner,
                    repositoryName,
                    issueState
                )}
            >
                {TRANSITION_LABELS[issueState]}
            </ButtonUnobtrusive>
        )}
    </ApolloConsumer>
    
)

/**
 * Renders a list of issues.
 *
 * @param {Object} issues - The list of issues.
 * @param {boolean} loading - Indicates if the issues are being loaded.
 * @param {string} repositoryOwner - The owner of the repository.
 * @param {string} repositoryName - The name of the repository.
 * @param {string} issueState - The state of the issues.
 * @param {function} fetchMore - Function to fetch more issues.
 * @return {JSX.Element} The rendered list of issues.
 */
const IssueList = ({issues, loading, repositoryOwner, repositoryName, issueState, fetchMore}) => (
    <div className="IssueList">
        {/* Map over the list of issues and render each one */}
        {issues.edges.map(({node}) => (
            <IssueItem key={node.id} issue={node} />
        ))}

        <FetchMore 
            loading={loading} 
            hasNextPage={issues.pageInfo.hasNextPage}
            variables={{
                cursor: issues.pageInfo.endCursor,
                repositoryOwner,
                repositoryName,
                issueState
            }}
            updateQuery={updateQuery}
            fetchMore={fetchMore}
        >
            Issues
        </FetchMore>
    </div>
)

export default withState(
    "issueState",
    "onChangeIssueState", 
    ISSUE_STATES.OPEN
)(Issues);