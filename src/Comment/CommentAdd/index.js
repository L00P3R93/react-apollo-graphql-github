import React from "react";
import { useMutation } from "@apollo/client";

import { ADD_COMMENT } from "./mutations";

import TextArea from '../../TextArea';
import Button from "../../Button";
import ErrorMessage from "../../Error";

const CommentAdd = ({ issueId }) => {
    const [value, setValue] = React.useState('');

    const handleChange = (newValue) => {
        setValue(newValue) 
    }

    const handleSubmit = async (event, addComment) => {
        await addComment();
        setValue('');
        event.preventDefault();
    }

    const [addComment, { loading, error, data }] = useMutation(ADD_COMMENT, {
        variables: { subjectId: issueId, body: value },
    })

    return (
        <div>
            {error && <ErrorMessage error={error} />}
            <form onSubmit={e => handleSubmit(e, addComment)}>
                <TextArea 
                    value={value}
                    onChange={e => handleChange(e.target.value)}
                    placeholder="Leave a Comment"
                />
                <Button type="submit">Comment</Button>
            </form>
        </div>
    )
}

export default CommentAdd