import { useState } from "react";
import Box from "@mui/material/Box";
import InputNumber from "@/components/input-number";

export default function Example() {
  const [value, setValue] = useState("");
  const handleChange = (val: any) => {
    setValue(val);
  };
  return (
    <Box className="container" sx={{ padding: 1 }}>
      <InputNumber value={value} onChange={handleChange} />
    </Box>
  );
}
