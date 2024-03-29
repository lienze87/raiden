import { ChangeEvent, useState, useEffect } from "react";
import { marked } from "marked";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";

export default function Editor() {
  const [content, setContent] = useState("");
  const [mdHtml, setMdHtml] = useState({
    __html: "",
  });

  useEffect(() => {
    const delayRender = setTimeout(() => {
      setMdHtml({
        __html: marked.parse(content),
      });
    }, 500);
    return () => clearTimeout(delayRender);
  }, [content]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  return (
    <Box className="container" sx={{ display: "flex", padding: 1 }}>
      <Box className="textarea" sx={{ flex: 1, marginRight: 1 }}>
        <div>文本输入框</div>
        <Box>
          <TextField
            value={content}
            multiline
            minRows={10}
            style={{ width: "100%" }}
            onChange={handleChange}
          />
        </Box>
      </Box>
      <Box className="render" sx={{ flex: 1 }}>
        <div>MarkDown</div>
        <Box
          sx={{
            padding: "14px",
            boxSizing: "border-box",
            height: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}>
          <div dangerouslySetInnerHTML={mdHtml}></div>
        </Box>
      </Box>
    </Box>
  );
}
