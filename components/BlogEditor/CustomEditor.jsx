import EditorJs from "react-editor-js";
import { tools } from "./toolsComponent";

function CustomEditor({ data, imageArray, handleInstance }) {
  return (
    <EditorJs
      instanceRef={(instance) => handleInstance(instance)}
      tools={tools}
      data={data}
      placeholder="Your blog content goes here"
    />
  );
}

export default CustomEditor;
