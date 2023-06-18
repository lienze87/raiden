import { useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

export default function BasicList() {
  const [checked, setChecked] = useState([0]);

  const dataList = [
    {
      index: 0,
      text: "设计原型图",
    },
    {
      index: 1,
      text: "设计基础架构",
    },
  ];

  const handleToggle = (index: number) => {
    const currentIndex = checked.indexOf(index);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(index);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <div className="title">代办事项</div>
      <List>
        {dataList.map((value: { index: number; text: string }) => {
          return (
            <ListItem key={value.index} disablePadding>
              <ListItemButton onClick={() => handleToggle(value.index)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(value.index) != -1}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={value.text}></ListItemText>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
