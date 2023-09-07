import React from "react";
import { gql, useQuery } from "@apollo/client";
import { withState } from "recompose";

import Loading from "../../Loading";
import ErrorMessage from "../../Error";
import IssueItem from "../IssueItem";
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

const GET_ISSUES_OF_REPOSITORY = gql`
    query(
        $repositoryOwner: String!, 
        $repositoryName: String!,
        $issueState: IssueState!
    ){
        repository(name: $repositoryName, owner: $repositoryOwner){
            issues(first: 5, states: [$issueState]){
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

const Issues = ({repositoryOwner, repositoryName, issueState, onChangeIssueState}) => {

    const { loading, error, data } = useQuery(GET_ISSUES_OF_REPOSITORY, {
        variables: { repositoryOwner, repositoryName, issueState }
    });

    // Log loading, error, and data to console
    console.log("Loading:", loading);
    console.log("Error:", error);
    console.log("Data:", data);

    // Render loading component if still loading
    if (loading) {
        return <Loading />;
    }

    // Render error message if there is an error
    if (error) {
        return <ErrorMessage error={error} />;
    }
    
    // Extract repository object from data
    const { repository } = data;
    console.log("Repository:", repository);

    const filteredRepository = {
        issues: {
            edges: repository.issues.edges.filter(
                issue => issue.node.state === issueState
            )
        }
    }

    console.log("Filtered repository:",filteredRepository);

    // Render message if there are no issues
    if (!filteredRepository.issues.edges.length) {
        return <div className="IssueList">No issues ...</div>;
    }

    // Render issue list component
    return (
        <div className="Issues">
            <ButtonUnobtrusive
                onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
            >
                {TRANSITION_LABELS[issueState]}
            </ButtonUnobtrusive>
            {isShow(issueState) && (
                <IssueList issues={filteredRepository.issues} />
            )}
        </div>
    );
}


/**
 * Render a list of issues.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.issues - The list of issues to render.
 * @returns {JSX.Element} - The rendered list of issues.
 */
const IssueList = ({issues}) => (
    <div className="IssueList">
        {/* Map over the list of issues and render each one */}
        {issues.edges.map(({node}) => (
            <IssueItem key={node.id} issue={node} />
        ))}
    </div>
)

export default withState(
    "issueState",
    "onChangeIssueState", 
    ISSUE_STATES.NONE
)(Issues);