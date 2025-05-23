import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

const ShortPost = (props: { id: string, filename: string, description: string }) => {
    const [filename, setFilename] = useState(props.filename);

    useEffect(() => {
        let filename = props.filename.indexOf('.') !== -1 ?
            props.filename.slice(0, props.filename.lastIndexOf('.')) :
            props.filename
        setFilename(filename);
    }, [props.filename]);

    if (props.id === "") {
        return (
            <article></article>
        );
    }
    return (
        <article>
            <h3><Link to={`/show/${props.id}`}>{filename}</Link></h3>
            <p>{props.description}</p>
            <ul className="actions">
                <li><Link to={`/show/${props.id}`} className="button small">Read</Link></li>
            </ul>
        </article>
    );
}

export default ShortPost;