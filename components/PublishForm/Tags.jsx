import { EditorContext } from "../Editor/EditorPage";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";

function Tags({ tag, tagIndex }) {
  let {
    blog,
    blog: { tags },
    setBlog,
  } = useContext(EditorContext);

  function tagDeleteHandler(e) {
    tags = tags.filter((t) => t != tag);
    setBlog({ ...blog, tags });
  }

  function tagEditHandler(e) {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      let currentTag = e.target.innerText;
      tags[tagIndex] = currentTag;
      setBlog({ ...blog, tags });
      e.target.setAttribute("contentEditable", false);
    }
  }

  function addEditable(e) {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  }

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
      <p
        className="outline-none"
        onKeyDown={tagEditHandler}
        onClick={addEditable}
      >
        {tag}
      </p>
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2 "
        onClick={tagDeleteHandler}
      >
        <XMarkIcon className="w-[1.1rem] pointer-events-none" />
      </button>
    </div>
  );
}

export default Tags;
