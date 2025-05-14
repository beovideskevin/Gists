import React, {SyntheticEvent, useEffect, useRef, useState} from 'react';
import {
    MDXEditor, MDXEditorMethods, headingsPlugin, quotePlugin, listsPlugin, thematicBreakPlugin, diffSourcePlugin,
    linkPlugin, linkDialogPlugin, tablePlugin, codeMirrorPlugin, codeBlockPlugin, imagePlugin, markdownShortcutPlugin,
    toolbarPlugin, UndoRedo, BlockTypeSelect, BoldItalicUnderlineToggles, ListsToggle, CreateLink, InsertImage, InsertTable,
    InsertThematicBreak, CodeToggle, InsertCodeBlock, Separator, DiffSourceToggleWrapper, ConditionalContents, ChangeCodeMirrorLanguage
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import codeBlockLanguages from "../types/codeBlockLanguages";

const Create = () => {
    const ref = React.useRef<MDXEditorMethods>(null);
    const [filename, setFilename] = useState("Untitled");
    const [updated, setUpdated] = useState(new Date().toString());
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState("private");
    const [id, setId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    });

    const submit = (e: SyntheticEvent) => {
        e.preventDefault();

        console.log(ref.current?.getMarkdown());
        const content = ref.current?.getMarkdown();

        axios.post("gists", {
            description: description,
            public: visibility == "public",
            files: {[filename]: {"content": `${content}`, "type": "text/markdown", "language": "Markdown"}}
        }).then(response => {
            navigate(`/show/${response.data.id}`);
        }).catch(error => {
            alert("Error saving data. Please check your internet connection or the URL.");
            console.log(error);
        });
    }

    return (
        <div className="inner">
            <Header filename={filename} updated={updated} url={url}/>
            <section>
                <form onSubmit={submit} className="editorForm">
                    <div className="row gtr-uniform">
                        <div className="col-6 col-12-small">
                            <input type="text" name="filename" id="filename" placeholder="File Name"
                                   onChange={e => setFilename(e.target.value)} value={filename}/>
                        </div>

                        <div className="col-3 col-12-small">
                            <input type="radio" id="private" name="visibility" checked={visibility == "private"}
                                   value="private" onChange={e => setVisibility(e.target.value)}/>
                            <label htmlFor="private">Private</label>
                        </div>

                        <div className="col-3 col-12-small">
                            <input type="radio" id="public" name="visibility" checked={visibility == "public"}
                                   value="public" onChange={e => setVisibility(e.target.value)}/>
                            <label htmlFor="public">Public</label>
                        </div>

                        <div className="col-12 col-12-small">
                            <input type="text" name="description" id="description" placeholder="Description"
                                   onChange={e => setDescription(e.target.value)} value={description}/>
                        </div>

                        <div className="col-12">
                            <MDXEditor
                                className="editorMain"
                                ref={ref}
                                markdown="Hello, world!"
                                plugins={[
                                    imagePlugin(),
                                    markdownShortcutPlugin(),
                                    headingsPlugin(),
                                    listsPlugin(),
                                    quotePlugin(),
                                    thematicBreakPlugin(),
                                    diffSourcePlugin(),
                                    linkPlugin(),
                                    linkDialogPlugin(),
                                    tablePlugin(),
                                    codeBlockPlugin({defaultCodeBlockLanguage: 'js'}),
                                    codeMirrorPlugin({
                                        codeBlockLanguages: codeBlockLanguages.reduce((acc: {
                                            [key: string]: string;
                                        }, language: string) => {
                                            acc[language] = language;
                                            return acc;
                                        }, {}),
                                    }),
                                    toolbarPlugin({
                                        toolbarContents: () => (
                                            <>
                                                <DiffSourceToggleWrapper>
                                                    <UndoRedo/>
                                                    <BlockTypeSelect/>
                                                    <BoldItalicUnderlineToggles/>
                                                    <Separator/>
                                                    <ListsToggle/>
                                                    <Separator/>
                                                    <CreateLink/>
                                                    <InsertTable/>
                                                    <InsertThematicBreak/>
                                                    <Separator/>
                                                    <InsertCodeBlock/>
                                                    <CodeToggle/>
                                                </DiffSourceToggleWrapper>
                                            </>
                                        )
                                    })
                                ]}
                            />
                        </div>
                        <div className="col-12">
                            <ul className="actions">
                                <li><input type="submit" value="Save" className="primary"/></li>
                                <li><input type="reset" value="Reset"
                                           onClick={() => ref.current?.setMarkdown('Hello, world!')}/></li>
                            </ul>
                        </div>
                    </div>
                </form>
            </section>
        </div>
);
}

export default Create;