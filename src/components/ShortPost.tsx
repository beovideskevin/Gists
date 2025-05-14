import React from "react";
import {Link} from "react-router-dom";

const ShortPost = (props: { id: string, filename: string, description: string }) => {
    return (
        <article>
            <h3>{props.filename}</h3>
            <p>{props.description}</p>
            <ul className="actions">
                <li><Link to={`/show/${props.id}`} className="button">Read</Link></li>
            </ul>
        </article>
    );
}

export default ShortPost;