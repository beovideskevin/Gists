import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import ShortPost from "../components/ShortPost";
import Why from "../components/Why";
import { marked } from "marked";
import { Link, useOutletContext } from "react-router-dom";
import axios from "axios";
import Gist from "../types/Gist";

const List = () => {
    const [abstract, setAbstract] = useState("");
    const [latest, setLatest] = useState<Gist>({
        id: "",
        filename: "",
        description: "",
        abstract: "",
        url: "",
        updated: "",
    });
    const [shortPosts, setShortPosts] = useState<Gist[]>([]);
    const context: { latest: Gist, starred: Gist[] } = useOutletContext();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (context === undefined) {
            return;
        }
        setLatest(context.latest);
        getLatestAbstract(context.latest);
        setShortPosts(context.starred);
    }, [context]);

    const getLatestAbstract = async (latest: Gist) => {
        if (latest.id === "") {
            return;
        }
        try {
            const response = await axios.get(`gists/${latest.id}`);
            const files:any = Object.values(response.data.files)[0];
            let abstract = files.content.split("\n").map((line: string) => {
                return line.length > 0 ? line + "\n" : "";
            }).join("").substring(0, 200);
            setAbstract(abstract);
        } catch (error) {
            alert("Error fetching data. Please check your internet connection or the URL.");
            console.log(error);
        }
    }

    if (latest.id === "") {
        return (
            <div id="main" className="noOverflowX">
                <div className="inner">
                    <Header filename="" url="" id="" />
                    <section>
                        <h2>Gists</h2>
                        <p>No gists found.</p>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div id="main" className="noOverflowX">
            <div className="inner">
                <Header filename={latest.filename} url={latest.url} id={latest.id} />
                <section className="abstract">
                    <div dangerouslySetInnerHTML={{__html: marked.parse(abstract) as string}}/>
                    <ul className="actions">
                        <li><Link to={`/show/${latest.id}`} className="button">Read</Link></li>
                    </ul>
                </section>

                <Why/>

                <section>
                    <header className="major">
                        <h2>Starred gists</h2>
                    </header>
                    <div className="posts">
                        {shortPosts.map((item: Gist, index: number) => (
                            <ShortPost id={item.id} filename={item.filename} key={index.toString()}
                                       description={item.description}/>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default List;