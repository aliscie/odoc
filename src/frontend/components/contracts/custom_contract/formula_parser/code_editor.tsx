import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";


interface Props {
    code: string;
    // onFormula: (formula: Formula) => any;
    onChange: (code: string) => any;

}

function CodeEditor(props: Props) {
    let onChange = (e: string) => {
        // console.log({e})
        props.onChange(e)
    }
    return (
        <AceEditor
            onChange={onChange}
            height="100px"
            width="500%"
            value={props.code}
            mode="javascript"
            theme="monokai"
            fontSize="16px"
            highlightActiveLine={true}
            options={{
                inlineSuggest: true,
                fontSize: "16px",
                formatOnType: true,
                autoClosingBrackets: true,
                minimap: {scale: 5}
            }}

            setOptions={{
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 2
            }}
        />
    );
}

export default CodeEditor;
