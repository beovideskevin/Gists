import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {marked} from 'marked';
import axios from "axios";
import Header from "../components/Header";
import {Link} from "react-router-dom";

const Show = () => {
    const { id } = useParams();
    const [files, setFiles] = useState({});
    const [url, setUrl] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(`gists/${id}`).then(data => {
            setUrl(data.data.html_url);
            setFiles(data.data.files);
        }).catch(error => {
            alert("Error fetching data. Please check your internet connection or the URL.");
            console.log(error);
            navigate(`/`);
        });
    }, [id]);

    return (
        <div id="main" className="noOverflowX">
            {
                Object.entries(files).map(([filename, data]: [string, any]) => (
                    <div className="inner" key={filename}>
                        <Header filename={filename.lastIndexOf('.') !== -1 ? filename.slice(0, filename.lastIndexOf('.')) : filename} url={url} id={id} />
                        <section>
                            <div dangerouslySetInnerHTML={{__html: marked.parse(data.content) as string}}/>
                            <ul className="actions actionsCenter">
                                <li><Link to={`/edit/${id}`} className="button primary">Edit</Link></li>
                            </ul>
                        </section>
                    </div>
                ))
            }
        </div>
    );
}

export default Show;