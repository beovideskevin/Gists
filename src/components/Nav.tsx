import React from 'react';
import NavItem from "../types/NavItem";
import {Link} from "react-router-dom";

const Nav = (props: { filteredItems: NavItem[] }) => {
    return (
        <nav id="menu">
            <header className="major">
                <h2>Gists</h2>
            </header>
            <ul>
            {props.filteredItems.map(item => (
                    <li key={item.id}><Link to={`/show/${item.id}`}>{item.name}</Link></li>
                ))}
            </ul>
        </nav>
    );
}

export default Nav;