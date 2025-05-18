import React, {SyntheticEvent, useEffect, useRef, useState} from "react";
import {
    BlockTypeSelect, BoldItalicUnderlineToggles,
    codeBlockPlugin, codeMirrorPlugin, CodeToggle, CreateLink,
    diffSourcePlugin, DiffSourceToggleWrapper,
    headingsPlugin,
    imagePlugin, InsertCodeBlock, InsertTable, InsertThematicBreak, linkDialogPlugin, linkPlugin,
    listsPlugin, ListsToggle,
    markdownShortcutPlugin,
    MDXEditor, MDXEditorMethods,
    quotePlugin, Separator, tablePlugin, thematicBreakPlugin, toolbarPlugin, UndoRedo
} from "@mdxeditor/editor";
import codeBlockLanguages from "../types/codeBlockLanguages";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Header from "./Header";
import '@mdxeditor/editor/style.css';


const Form = (props: {id: string|undefined }) => {
    const ref = useRef<MDXEditorMethods>(null);
    const [filename, setFilename] = useState("Untitled");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState("private");
    const [initialContent, setInitialContent] = useState("Hello, world!");
    const [initialFilename, setInitialFilename] = useState("Untitled");
    const [initialDescription, setInitialDescription] = useState("");
    const [initialVisibility, setInitialVisibility] = useState("private");
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!props.id) {
            return;
        }
        axios.get(`gists/${props.id}`).then(data => {
            if (Object.values(data.data.files).length === 0) {
                navigate(`/`);
                return;
            }
            setUrl(data.data.html_url);
            setDescription(data.data.description);
            setInitialDescription(data.data.description);
            setVisibility(data.data.public ? "public" : "private");
            setInitialVisibility(data.data.public ? "public" : "private");
            const files:any = Object.values(data.data.files)[0];
            setFilename(files.filename);
            setInitialFilename(files.filename);
            const content = files.content
                .trim()
                .replace(/```\w+/g, (str: string) => str.toLowerCase()) // Fixes the problem with capital letters in code blocks
                .replace(/\n\n\n+/g, '\n\n') // Remove extra new lines, "fixes horror vacui" bug
            setInitialContent(content);
            ref.current?.setMarkdown(content)
        }).catch(error => {
            alert("Error fetching data. Please check your internet connection or the URL.");
            console.log(error);
            navigate(`/`);
        });
    }, [props.id]);

    const cancel = () => {
        if (window.confirm("Are you sure? You will lose the changes.")) {
            navigate(`/show/${props.id}`);
        }
    }

    const resetGist = () => {
        if (window.confirm("Are you sure? This will reset the gist to its original state.")) {
            setFilename(initialFilename);
            setDescription(initialDescription);
            setVisibility(initialVisibility);
            ref.current?.setMarkdown(initialContent)
        }
    }

    const submit = (e: SyntheticEvent) => {
        e.preventDefault();
        console.log("saved!");
        if (filename.length === 0) {
            alert("Please enter a filename.");
            return;
        }
        const content = ref.current?.getMarkdown()
            .trim()
            .replace(/\n\n\n+/g, '\n\n') // Remove extra new lines, "fixes horror vacui" bug
            .replace(/&#.*;/g, ''); // Remove HTML entities for utf8 chars; another bug
        const payload = {
            description: description,
            public: visibility === "public",
            files: {[filename]: {"content": `${content}`, "type": "text/markdown", "language": "Markdown"}}
        };
        if (props.id) {
            axios.patch(`gists/${props.id}`, payload).then(response => {
                setInitialFilename(filename);
                setInitialDescription(description);
                setInitialVisibility(visibility);
                setInitialContent(content || "");
                alert("Gist saved successfully!");
            }).catch(error => {
                alert("Error saving data. Please check your internet connection or the URL.");
                console.log(error);
            });
        }
        else {
            axios.post("gists", payload).then(response => {
                navigate(`/show/${response.data.id}`);
            }).catch(error => {
                alert("Error saving data. Please check your internet connection or the URL.");
                console.log(error);
            });
        }
    }

    return (
        <div className="inner">
            <Header filename={filename} url={url} id={props.id}/>
            <section>
                <form onSubmit={submit}>
                    <div className="row gtr-uniform">
                        <div className="col-6 col-12-small">
                            <input type="text" name="filename" id="filename" placeholder="File Name"
                                   onChange={e => setFilename(e.target.value)} value={filename}/>
                        </div>

                        <div className="col-3 col-12-small">
                            <input type="radio" id="private" name="visibility" checked={visibility === "private"}
                                   value="private" onChange={e => setVisibility(e.target.value)}/>
                            <label htmlFor="private">Private</label>
                        </div>

                        <div className="col-3 col-12-small">
                            <input type="radio" id="public" name="visibility" checked={visibility === "public"}
                                   value="public" onChange={e => setVisibility(e.target.value)}/>
                            <label htmlFor="public">Public</label>
                        </div>

                        <div className="col-12 col-12-small">
                            <input type="text" name="description" id="description" placeholder="Description"
                                   onChange={e => setDescription(e.target.value)} value={description}/>
                        </div>

                        <div className="col-12">
                            <MDXEditor
                                onError={(error) => {console.log(error)}}
                                className="editorForm"
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
                                    codeBlockPlugin({defaultCodeBlockLanguage: 'javascript'}),
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
                        <div className="col-12 fixedBtns">
                            <ul className="actions actionsCenter">
                                <li><input type="reset" value="Cancel"
                                           onClick={() => cancel()}/></li>
                                <li><input type="reset" value="Reset"
                                           onClick={() => resetGist()}/></li>
                                <li><input type="submit" value="Save" className="primary"/></li>
                            </ul>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default Form;