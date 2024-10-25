import React from "react";
import CodeEditor from "../ContractTable/FormulaParser/CodeEditor";
import AlertDialog from "../MuiComponents/AlertDialog";

interface Props {
  onAddFormula: (formula: string) => void;
  contextMenuProps: any;
}

function InsertFormula(props: Props) {
  const [formula, setFormula] = React.useState<string>("");

  function handleSave() {
    props.onAddFormula(formula);
  }

  const content = (
    <>
      auto complete values:{" "}
      <>
        {Object.keys(props.contextMenuProps.row).map((k) => (
          <div style={{ color: "orange" }}>{k + " "}</div>
        ))}
      </>
      <CodeEditor
        onChange={(c) => {
          setFormula(c);
          // code = c;
          // `conso`le.log("code is here:  "+code);
          // setFormatter(code);
          // dispatch(handleRedux("TOP_DIALOG", {...top_dialog, code: code}));
        }}
        code={formula}
      />
    </>
  );

  return (
    <>
      <AlertDialog submit={'Save'} handleSave={handleSave} content={content}>
        Formula
      </AlertDialog>
    </>
  );
}

export default InsertFormula;
