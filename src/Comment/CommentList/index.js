import React, { Fragment } from 'react'

import { useQuery } from '@apollo/client'

import { GET_COMMENTS_OF_ISSUE } from './queries'
import Comment from '../CommentItem'
import CommentAdd from '../CommentAdd';

import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import FetchMore from '../../FetchMore';

import './style.css';


const updateQuery = (previousResult, { fetchMoreResult }) => {
    if(!fetchMoreResult) return previousResult;

    return {
        ...previousResult,
        repository: {
            ...previousResult.repository,
            issue: {
                ...previousResult.repository.issue,
                ...fetchMoreResult.repository.issue,
                comments: {
                    ...previousResult.repository.issue.comments,
                    ...fetchMoreResult.repository.issue.comments,
                    edges: [
                        ...previousResult.repository.issue.comments.edges,
                        ...fetchMoreResult.repository.issue.comments.edges
                    ],
                },
            },
        },
    };
};

const Comments = ({ repositoryOwner, repositoryName, issue }) => {
    const { loading, error, data, fetchMore } = useQuery(GET_COMMENTS_OF_ISSUE, {
        variables: { repositoryOwner, repositoryName, number: issue.number },
        notifyOnNetworkStatusChange: true,
    })

    if (error) {
        console.error(error);
        return <ErrorMessage error={error} />;
    }
    if (loading) {
        console.log('Loading comments...');
        return <Loading />;
    }

    const { repository } = data;
    console.log(repository);

    return (
        <Fragment>
            <CommentList 
                comments={repository.issue.comments}
                loading={loading}
                number={issue.number}
                repositoryOwner={repositoryOwner}
                repositoryName={repositoryName}
                fetchMore={fetchMore}
            />

            <CommentAdd issueId={repository.issue.id} />
        </Fragment>
    );
}

const CommentList = ({
    comments,
    loading,
    repositoryOwner,
    repositoryName,
    number,
    fetchMore
}) => (
    <div className='CommentList'>
        {comments.edges.map(({node}) => (
            <Comment key={node.id} comment={node} />
        ))}
        <FetchMore
            loading={loading}
            hasNextPage={comments.pageInfo.hasNextPage}
            variables={{
                cursor: comments.pageInfo.endCursor,
                repositoryOwner,
                repositoryName,
                number
            }}
            updateQuery={updateQuery}
            fetchMore={fetchMore}
        >
            Comments
        </FetchMore>
    </div>
)

export default Comments;
