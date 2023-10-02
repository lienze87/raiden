import { useState } from "react";
import Box from "@mui/material/Box";
import MdEditor from "@/components/mdEditor/index";

export default function MainApp() {
  const [text, setText] = useState("");
  const handleChange = (str: string) => {
    console.log(str);
    setText(str);
  };

  return (
    <Box className="container" sx={{ padding: 1 }}>
      <MdEditor onChange={handleChange} />
    </Box>
  );
}
