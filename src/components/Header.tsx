import React, {useEffect, useState} from "react";

const Header = (props: { filename: string, updated: string, url: string }) => {
    const [date, setDate] = useState("");
    useEffect(() => {
        if (props.updated === "") {
            setDate("No date");
            return;
        }
        const updatedDate = new Date(props.updated);
        setDate(updatedDate.toLocaleDateString())
    }, []);

    return (
        <header id="header">
            <a className="logo" href={props.url} target="_blank" rel="noopener noreferrer"><strong>{props.filename}</strong> ({date})</a>
        </header>
    );
};

export default Header;