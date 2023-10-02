import { useState } from "react";
import Box from "@mui/material/Box";
import Editor from "@/components/editor/index";

export default function MainApp() {
  return (
    <Box className="container" sx={{ padding: 1 }}>
      <Editor />
    </Box>
  );
}
