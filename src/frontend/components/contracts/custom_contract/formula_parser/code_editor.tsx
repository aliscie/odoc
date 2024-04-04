import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/ext-language_tools";

interface Props {
  code: string;
  onChange: (code: string) => any;
}

function CodeEditor(props: Props) {
  let onChange = (e: string) => {
    props.onChange(e);
  };
  let browser_font = document.getElementsByTagName("html")[0].style.fontSize;
  console.log(browser_font);

  return (
    <AceEditor
      onChange={onChange}
      height="100px"
      width="100%"
      value={props.code}
      mode="javascript"
      theme="monokai"
      options={{
        // Use fontFamily for specific font control (optional)
        // fontFamily: browser_font,
        // inlineSuggest: true,
        // fontSize: "16px",
        // formatOnType: true,
        // autoClosingBrackets: true,
        // minimap: { scale: 5 },
      }}
      setOptions={{
        // enableLiveAutocompletion: false,
        // showLineNumbers: true,
        // tabSize: 2,
      }}
    />
  );
}

export default CodeEditor;
