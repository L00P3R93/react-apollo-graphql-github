import React from 'react'

import FetchMore from '../../FetchMore';
import RepositoryItem from '../RepositoryItem'

import '../style.css'

const getUpdateQuery = entry => (
    previousResult, 
    {fetchMoreResult}
) => {
    if(!fetchMoreResult) return previousResult;

    return {
        ...previousResult,
        [entry]: {
            ...previousResult[entry],
            repositories: {
                ...previousResult[entry].repositories,
                ...fetchMoreResult[entry].repositories,
                edges: [
                    ...previousResult[entry].repositories.edges,
                    ...fetchMoreResult[entry].repositories.edges,
                ],
            },
        },
    };
};

const RepositoryList = ({loading, repositories, fetchMore, entry}) => (
    <>
        {repositories.edges.map(({node}) => (
            <div key={node.id} className='RepositoryItem'>
                <RepositoryItem {...node} />
            </div>
        ))}

        <FetchMore
            loading={loading}
            hasNextPage={repositories.pageInfo.hasNextPage}
            variables={{
                cursor: repositories.pageInfo.endCursor
            }}
            updateQuery={getUpdateQuery(entry)}
            fetchMore={fetchMore}    
        >
            Repos
        </FetchMore>
    </>
)
   

export default RepositoryList