import React from 'react';
import NavItem from "../types/NavItem";
import GistLink from "./GistLink";

const Nav = (props: { filteredItems: NavItem[] }) => {
    return (
        <nav id="menu">
            <header className="major">
                <h2>Gists</h2>
            </header>
            <ul>
            {props.filteredItems.map(item => (
                <GistLink item={item} key={item.id}/>
                ))}
            </ul>
        </nav>
    );
}

export default Nav;