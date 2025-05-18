import React from "react";
import {Link} from "react-router-dom";

const ShortPost = (props: { id: string, filename: string, description: string }) => {
    if (props.id === "") {
        return (
            <article></article>
        );
    }
    return (
        <article>
            <h3><Link to={`/show/${props.id}`}>{props.filename}</Link></h3>
            <p>{props.description}</p>
            <ul className="actions">
                <li><Link to={`/show/${props.id}`} className="button">Read</Link></li>
            </ul>
        </article>
    );
}

export default ShortPost;