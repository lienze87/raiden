import Box from "@mui/material/Box";
import WhiteBoard from "@/components/white-board/index";

export default function MainApp() {
  return (
    <Box className="container" sx={{ padding: 1 }}>
      <WhiteBoard />
    </Box>
  );
}
