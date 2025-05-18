import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import NavItem from "../types/NavItem";
import axios from "axios";

const GistLink = (props: { item: NavItem }) => {
    const [starred, setStarred] = useState(false);

    useEffect(() => {
        setStarred(props.item.starred);
    }, [props.item.starred]);

    const removeStar = () => {
        axios.delete(`gists/${props.item.id}/star`).then(response => {
            setStarred(false);
        }).catch(error => {
            alert("Error fetching data. Please check your internet connection or the URL.");
            console.log(error);
        });
    }

    const star = () => {
        axios.put(`gists/${props.item.id}/star`).then(response => {
            setStarred(true);
        }).catch(error => {
            alert("Error fetching data. Please check your internet connection or the URL.");
            console.log(error);
        });
    }

    return (
        <li>{starred ? <span className="icon solid fa-star littlestar" onClick={e => {removeStar()}}>&nbsp;</span> :
            <span className="icon fa-star littlestar" onClick={e => {star()}}>&nbsp;</span>} <Link
            to={`/show/${props.item.id}`}>{props.item.name}</Link></li>
    );
};
export default GistLink;
