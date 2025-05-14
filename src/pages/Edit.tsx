import React, {SyntheticEvent, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {
    MDXEditor, MDXEditorMethods, headingsPlugin, quotePlugin, listsPlugin, thematicBreakPlugin, diffSourcePlugin,
    linkPlugin, linkDialogPlugin, tablePlugin, codeMirrorPlugin, codeBlockPlugin, markdownShortcutPlugin, imagePlugin,
    toolbarPlugin, UndoRedo, BlockTypeSelect, BoldItalicUnderlineToggles, ListsToggle, CreateLink, InsertImage, InsertTable,
    InsertThematicBreak, CodeToggle, InsertCodeBlock, Separator, DiffSourceToggleWrapper, ConditionalContents, ChangeCodeMirrorLanguage
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import Header from "../components/Header";
import axios from "axios";
import codeBlockLanguages from "../types/codeBlockLanguages";

const Edit = (props: any) => {
    const { id } = useParams();
    const ref = React.useRef<MDXEditorMethods>(null);
    const [filename, setFilename] = useState("Untitled");
    const [updated, setUpdated] = useState(new Date().toString());
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState("private");
    const [initialContent, setInitialContent] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(`gists/${id}`).then(data => {
            setUpdated(data.data.updated_at);
            setUrl(data.data.html_url);
            setDescription(data.data.description);
            setVisibility(data.data.public ? "public" : "private");
            let content = "";
            Object.entries(data.data.files).map(([filename, data]: [string, any]) => {
                setFilename(filename);
                content = data.content;
            });
            setInitialContent(content);
            ref.current?.setMarkdown(content)
        }).catch(error => {
            alert("Error fetching data. Please check your internet connection or the URL.");
            console.log(error);
        });
    }, []);

    const submit = (e: SyntheticEvent) => {
        e.preventDefault();

        console.log(ref.current?.getMarkdown());
        const content = ref.current?.getMarkdown();

        axios.patch(`gists/${id}`, {
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
                                   onChange={e => setFilename(e.target.value)} value={filename} />
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
                                   onChange={e => setDescription(e.target.value)} value={description} />
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
                                        codeBlockLanguages: codeBlockLanguages.reduce((acc: {[key: string]: string;}, language: string) => {
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
                                           onClick={() => ref.current?.setMarkdown(initialContent)}/></li>
                            </ul>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default Edit;