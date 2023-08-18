import React from 'react'
import { gql, useMutation } from '@apollo/client'

import Link from '../../Link'
import Button  from '../../Button'

import '../style.css'

const STAR_REPOSITORY = gql`
    mutation($id:ID!){
        addStar(input: {starrableId: $id}){
            starrable {
                id
                viewerHasStarred
            }
        }
    }
`;


const RepositoryItem = ({
    id,
    name,
    url,
    descriptionHTML,
    primaryLanguage,
    owner,
    stargazers,
    watchers,
    viewerSubscription,
    viewerHasStarred
}) => {

    const [addStar, {data, loading, error}] = useMutation(STAR_REPOSITORY)

    return (
        <div>
            <div className='RepositoryItem-title'>
                <h2>
                    <Link href={url}>{name}</Link>
                </h2>
                <div>
                    {!viewerHasStarred ? (
                        <Button
                            className={'RepositoryItem-title-action'}
                            onClick={e => {
                                e.preventDefault();
                                addStar({variables: {
                                    id: id,
                                }})
                            }}>
                            {stargazers.totalCount} Star
                        </Button>
                    ): (
                        <span></span>
                    )

                    }
                </div>
            </div>
            <div className='RepositoryItem-description'>
                <div className='RepositoryItem-description-info' dangerouslySetInnerHTML={{__html:descriptionHTML}} />
                <div className='RepositoryItem-description-details'>
                    <div>
                        {primaryLanguage && (
                            <span>Language: {primaryLanguage.name}</span>
                        )}
                    </div>
                    <div>
                        {owner && (
                            <span>
                                Owner: <a href={owner.url}>{owner.login}</a>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RepositoryItem