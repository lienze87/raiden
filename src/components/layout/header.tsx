import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

export default function Header() {
  const navList = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Editor",
      path: "/editor",
    },
    {
      name: "Admin",
      path: "/admin",
    },
  ];

  const pathname = usePathname();

  return (
    <>
      <header>
        <nav>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 16px",
              textAlign: "center",
              backgroundColor: "#d6d6d6",
            }}>
            <Typography variant="h6">Application</Typography>
            <Divider />
            <List sx={{ display: "flex", justifyContent: "center" }}>
              {navList.map((item) => (
                <ListItem key={item.name} disablePadding>
                  <ListItemButton
                    selected={pathname === item.path}
                    LinkComponent={Link}
                    href={item.path}
                    sx={{ textAlign: "center" }}>
                    <ListItemText primary={item.name}></ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </nav>
      </header>
    </>
  );
}
