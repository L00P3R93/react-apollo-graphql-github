import React from "react";
import { withState } from "recompose";

import Button from '../../Button'
import Comments from '../../Comment'
import Link from '../../Link';

import './style.css'


/**
 * Renders an IssueItem component.
 *
 * @param {Object} issue - The issue object.
 * @param {string} repositoryOwner - The owner of the repository.
 * @param {string} repositoryName - The name of the repository.
 * @param {boolean} isShowComments - Indicates if the comments should be shown.
 * @param {function} onShowComments - The function to toggle the display of comments.
 * @return {JSX.Element} The rendered IssueItem component.
 */
const IssueItem = ({
	issue,
	repositoryOwner,
	repositoryName,
	isShowComments,
	onShowComments
}) => {
  return (
	<div className="IssueItem">
		<Button onClick={() => onShowComments(!isShowComments)}>
			{isShowComments ? '-' : '+'}
		</Button>


		<div className="IssueItem-content">
			<h3>
				<Link href={issue.url}>{issue.title}</Link>
			</h3>
			<div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }} />

			{isShowComments && (
				<Comments 
					repositoryOwner={repositoryOwner}
					repositoryName={repositoryName}
					issue={issue}
				/>
			)}
		</div>
	</div>
  );
}

export default withState('isShowComments', 'onShowComments', false)(
	IssueItem
)