import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import "./main.css";

function createData(
  title: string,
  type: string,
  count: number,
  createTime: string,
  updateTime: string
) {
  return { title, type, count, createTime, updateTime };
}

const rows = [
  createData("Frozen yoghurt", "txt", 3000, "2023/10/01", "2023/10/02"),
  createData("Ice cream sandwich", "md", 3000, "2023/10/01", "2023/10/02"),
  createData("Eclair", "txt", 3000, "2023/12/01", "2023/12/02"),
  createData("Cupcake", "md", 3000, "2023/11/01", "2023/11/02"),
  createData("Gingerbread", "txt", 3000, "2023/11/01", "2023/11/02"),
];

export default function BasicTable() {
  const [dataList, setDataList] = useState(rows);

  const handleRemove = (data: any, index: number) => {
    let tempList = dataList.slice();
    tempList.splice(index, 1);

    setDataList(tempList);
  };

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
            {dataList.map((row, index) => (
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
                    onClick={() => handleRemove(row, index)}>
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
