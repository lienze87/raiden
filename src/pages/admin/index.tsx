import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

function createData(
  title: string,
  type: number,
  count: number,
  createTime: number,
  updateTime: number
) {
  return { title, type, count, createTime, updateTime };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const handleRemove = (data: any) => {};

export default function BasicTable() {
  return (
    <div className="container">
      <div className="action-bar">
        <Button variant="contained">新增</Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>标题</TableCell>
              <TableCell align="right">类型</TableCell>
              <TableCell align="right">字数</TableCell>
              <TableCell align="right">发布时间</TableCell>
              <TableCell align="right">最后修改时间</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.title}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{row.count}</TableCell>
                <TableCell align="right">{row.createTime}</TableCell>
                <TableCell align="right">{row.updateTime}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemove(row)}>
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
