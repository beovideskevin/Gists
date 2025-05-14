import React, {useEffect, useState} from 'react';
import Search from "./Search";
import About from './About';
import Nav from "./Nav";
import New from "./New";
import Copy from "./Copy";
import NavItem from "../types/NavItem";

const Sidebar = (props: { navItems: NavItem[] }) => {
    const [filtered, setFiltered] = useState<NavItem[]>([]);
    const [sidebar, setSidebar] = useState(true);

    useEffect(() => {
        setFiltered(props.navItems);
    }, [props.navItems]);

    const toggleSidebar = () => {
        setSidebar(!sidebar);
    }

    return (
        <div id="sidebar" className={sidebar ? "visible" : "hidden"}>
            <div className="toggle" onClick={e => toggleSidebar()}>Toggle</div>
            <div className="inner">
                <Search navItems={props.navItems} filteredItems={setFiltered} />
                <Nav filteredItems={filtered}/>
                <New />
                <About />
                <Copy />
            </div>
        </div>
    );
}

export default Sidebar;