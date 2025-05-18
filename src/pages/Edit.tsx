import React from 'react';
import {useParams} from "react-router-dom";
import Form from "../components/Form";

const Edit = () => {
    const { id } = useParams();

    return (
        <div id="main">
            <Form id={id} />
        </div>
    );
}

export default Edit;