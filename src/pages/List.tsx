import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Abstract from "../types/Abstract";
import ShortPost from "../components/ShortPost";
import Why from "../components/Why";
import { marked } from "marked";
import { Link, useOutletContext } from "react-router-dom";
import axios from "axios";
import NavItem from "../types/NavItem";

const List = () => {
    const [filename, setFilename] = useState("");
    const [abstract, setAbstract] = useState("");
    const [updated, setUpdated] = useState("");
    const [url, setUrl] = useState("");
    const [id, setId] = useState("");
    const [shortPosts, setShortPosts] = useState<Abstract[]>([]);
    const context:NavItem[] = useOutletContext();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (context == undefined || context.length == 0) {
            return
        }
        let allItems: Abstract[] = [];
        context.map(async (item) => {
            try {
                const response = await axios.get(`gists/${item.id}`);
                let abstract = "";
                Object.entries(response.data.files).map(([filename, data]: [string, any]) => {
                    data.content.split("\n").map((line: string) => {
                        if (line.length > 0 && abstract.length < 200) {
                            abstract += line + "\n";
                        }
                    });
                    const item = {
                        id: response.data.id,
                        description: response.data.description,
                        filename: filename,
                        abstract: abstract,
                        updated: response.data.updated_at,
                        url: response.data.html_url,
                    };
                    allItems.push(item);
                });
            }
            catch(error) {
                alert("Error fetching data. Please check your internet connection or the URL.");
                console.log(error);
            }

            if (allItems.length >= 1) {
                setFilename(allItems[0].filename);
                setAbstract(allItems[0].abstract);
                setUpdated(allItems[0].updated);
                setUrl(allItems[0].url);
                setId(allItems[0].id);
            }
            setShortPosts(allItems.slice(1));
        });
    }, [context]);

    if (id == "") {
        return (
            <div className="inner">
                <Header filename="" updated="" url=""/>
                <section>
                    <h2>Gists</h2>
                    <p>No gists found.</p>
                    <div className="editBtn">
                        <Link to='/create/' className="button primary">New Gist</Link>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="inner">
            <Header filename={filename} updated={updated} url={url}/>
            <section dangerouslySetInnerHTML={{__html: marked.parse(abstract) as string}}/>
            <div>
                <ul className="actions">
                    <li><Link to={`/show/${id}`} className="button">Read</Link></li>
                    <li><Link to={`/edit/${id}`} className="button primary">Edit</Link></li>
                </ul>
            </div>

            <Why />

            <section>
                <header className="major">
                    <h2>Latest updates</h2>
                </header>
                <div className="posts">
                    {shortPosts.map((item: Abstract, index: number) => (
                        <ShortPost id={item.id} filename={item.filename} key={index.toString()}
                                   description={item.description || item.abstract}/>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default List;