import { gql } from "@apollo/client";

export const ADD_COMMENT = gql`
    mutation($subjectId: ID!, $body: String!){
        addComment(input: { subjectId: $subjectId, body: $body }){
            commentEdge {
                node {
                    body
                }
            }
        }
    }
`;