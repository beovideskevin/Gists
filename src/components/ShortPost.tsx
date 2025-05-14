import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";

const Abstract = (props: { id: string, filename: string, description: string }) => {
    return (
        <article>
            <h3>{props.filename}</h3>
            <p>{props.description}</p>
            <ul className="actions">
                <li><Link to={`/show/${props.id}`} className="button">Read</Link></li>
                <li><Link to={`/edit/${props.id}`} className="button primary">Edit</Link></li>
            </ul>
        </article>
    );
}

export default Abstract;