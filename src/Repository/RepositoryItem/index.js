import React from 'react'
import { gql, useMutation } from '@apollo/client'

import Link from '../../Link'
import Button  from '../../Button'

import '../style.css'

import {
    STAR_REPOSITORY,
    UNSTAR_REPOSITORY,
    WATCH_REPOSITORY
} from '../mutations'

const VIEWER_SUBSCRIPTIONS = {
    SUBSCRIBED: 'SUBSCRIBED',
    UNSUBSCRIBED: 'UNSUBSCRIBED'
}

const isWatch = viewerSubscription => 
    viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

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
    const [addStar, {addData, addLoading, addError}] = useMutation(STAR_REPOSITORY)
    const [removeStar, {removeData, removeLoading, removeError}] = useMutation(UNSTAR_REPOSITORY)
    const [updateSubscription, {subscribeData, subscribeLoading, subscribeError}] = useMutation(WATCH_REPOSITORY)

    const handleAction = (mutationFn, subscribeFn=false) => e => {
        e.preventDefault()
        if(subscribeFn){
            updateSubscription({
                variables: {
                    id: id,
                    viewerSubscription: isWatch(viewerSubscription) 
                        ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                        : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
                }
            });
        }else{
            mutationFn({
                variables: { id: id },
            });
        }
    }

    return (
        <div>
            <div className='RepositoryItem-title'>
                <h2>
                    <Link href={url}>{name}</Link>
                </h2>
                <div>
                    <Button
                        className="RepositoryItem-title-action"
                        data-test-id="updateSubscription"
                        onClick={handleAction(null, true)}
                        disabled={subscribeLoading}>
                        {watchers.totalCount}{' '}
                        {isWatch(viewerSubscription)? 'Unwatch' : 'Watch'}
                    </Button>

                    {!viewerHasStarred ? (
                        <Button
                            className='RepositoryItem-title-action'
                            onClick={handleAction(addStar)}
                            disabled={addLoading}>
                            {stargazers.totalCount} Star
                        </Button>
                    ): (
                        <Button
                            className='RepositoryItem-title-action'
                            onClick={handleAction(removeStar)}
                            disabled={removeLoading}>
                            {stargazers.totalCount} UnStar
                        </Button>
                    )}

                    {/** Here comes your updateSubscription mutation*/}
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