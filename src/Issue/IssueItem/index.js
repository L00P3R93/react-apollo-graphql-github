import React from "react";

import Link from '../../Link';

import './style.css'

/**
 * Render a single issue item.
 *
 * @param {Object} props - The props object containing the data for the issue item.
 * @return {JSX.Element} The rendered issue item component.
 */
const IssueItem = ({props}) => {
  return (
	<div className="IssueItem">
		<div className="IssueItem-content">
			<h3>
				<Link href={props.url}>{props.title}</Link>
			</h3>
			<div dangerouslySetInnerHTML={{ __html: props.bodyHTML }} />
		</div>
	</div>
  );
}

export default IssueItem