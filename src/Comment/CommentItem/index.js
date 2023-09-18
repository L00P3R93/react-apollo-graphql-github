import React from "react";

const Comment = ({comment}) => 
    <div className="CommentItem">
        <div>{comment.author.login}:</div>
        &nbsp;
        <div dangerouslySetInnerHTML={{ __html: comment.bodyHTML }}></div>
    </div>

export default Comment