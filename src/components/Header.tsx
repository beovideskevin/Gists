import React, {SyntheticEvent, useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = (props: { filename: string, url: string, id: string | undefined }) => {
    const [filename, setFilename] = useState(props.filename);
    const navigate = useNavigate();

    useEffect(() => {
        let filename = props.filename.indexOf('.') !== -1 ?
            props.filename.slice(0, props.filename.lastIndexOf('.')) :
            props.filename
        setFilename(filename);
        document.title = `Gist - ${filename}`;
    }, [props.filename]);

    const delGist = (e: SyntheticEvent) => {
        if (window.confirm("Are you sure you want to delete this gist?")) {
            axios.delete(`gists/${props.id}`).then(data => {
                console.log(data);
                navigate('/');
            }).catch(error => {
                alert("Error fetching data. Please check your internet connection or the URL.");
                console.log(error);
            });
        }
    }

    return (
        <header id="header">
            {props.id !== "" ?
                <Link className="logo" to={`/show/${props.id}`}><strong>{filename}</strong></Link> :
                <div className="logo"><strong>{filename}</strong></div>}

            {props.id !== "" ?
                <ul className="icons">
                    <li><Link to={`/edit/${props.id}`} className="icon solid fa-edit">&nbsp;</Link></li>
                    <li><Link to={props.url} className="icon solid fa-link" target="_blank"
                              rel="noopener noreferrer">&nbsp;</Link></li>
                    <li><Link to={"#"} onClick={e => {
                        delGist(e)
                    }} className="icon solid fa-trash">&nbsp;</Link></li>
                    <li><Link to={"/"} className="icon solid fa-home">&nbsp;</Link></li>
                </ul> :
                <ul className="icons">
                    <li><Link to="/" className="icon solid fa-home">&nbsp;</Link></li>
                </ul>
            }
        </header>
    );
};

export default Header;