import React from "react";
import { useMutation } from "@apollo/client";

import { ADD_COMMENT } from "./mutations";

import TextArea from '../../TextArea';
import Button from "../../Button";
import ErrorMessage from "../../Error";
import Loading from "../../Loading";

const CommentAdd = ({ issueId }) => {
    const [value, setValue] = React.useState('');

    const handleChange = (newValue) => {
        setValue(newValue) 
    }

    const handleSubmit = (event, addComment) => {
        addComment().then(() => this.setState({ value: '' }));

        event.preventDefault();
    }

    const [addComment, { loading, error }] = useMutation(ADD_COMMENT, {
        variables: { subjectId: issueId, body: value },
    })

    return (
        <div>
            {error && <ErrorMessage error={error} />}
            {loading && <Loading />}
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