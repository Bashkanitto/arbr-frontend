import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const WYSIWYGEditor = ({ value = "" }) => {
  const [content, setContent] = useState(value);

  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <ReactQuill theme="snow" value={content} onChange={setContent} />
    </div>
  );
};

export default WYSIWYGEditor;
