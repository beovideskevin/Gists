import React, { useEffect, useState } from "react";
import NavItem from "../types/NavItem";

const Search = (props: { navItems: NavItem[], filteredItems: (navItems: NavItem[]) => void }) => {
    const [search, setSearch] = useState("");

    useEffect(() => {
        const results = props.navItems.filter(
            (item) => item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.desc.toLowerCase().includes(search.toLowerCase())
        );
        props.filteredItems(results);
    }, [search, props.navItems]);

    return (
        <section id="search" className="alt">
            <form method="post" onSubmit={e => e.preventDefault()}>
                <input
                    type="text"
                    name="query"
                    id="query"
                    placeholder="Search Gists..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value)
                    }}
                />
            </form>
        </section>
    );
};

export default Search;