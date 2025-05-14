import React from 'react';
import {Link} from "react-router-dom";

const New = () => {
    return (
        <section>
            <header className="major">
                <h2>Add content</h2>
            </header>
            <p>If you can't find what you are looking for, maybe you should create a new gist.</p>
            <ul className="actions">
                <li id="createNewBtn"><Link to="/create" className="button primary">New</Link></li>
            </ul>
        </section>
    );
}

export default New;