import * as React from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { CheckBox, Box, Button } from "@mui/icons-material";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
// import CancelIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
// import CancelIcon from '@mui/icons-material/Cancel';
import {
  DataGrid,
  GridToolbarContainer,
  GridRowModes,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const columns = [
  { field: "time", headerName: "Time", flex: 1 },
  //   { field: "is_available", headerName: "First name", width: 130 },
  { field: "price", headerName: "Price", flex: 1 },

  {
    field: "is_available",
    headerName: "Pitch 1",
    flex: 1,
    renderCell: (params) => {
      return params.value === "false" ? (
        <Box
          sx={{
            marginTop: 0,
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // justifyContent: "center",
            // minWidth: "100%",
          }}
        >
          <Checkbox
            defaultValue={false}
            // disabled
            sx={{
              color: blue[800],
              "&.Mui-checked": {
                color: blue[600],
              },
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            marginTop: 0,
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // justifyContent: "center",
            // minWidth: "100%",
          }}
        >
          <Checkbox
            disabled
            checked
            sx={{
              color: grey[800],
              "&.Mui-checked": {
                color: blue[600],
              },
            }}
          />
        </Box>
      );
    },
    // width: 90,
  },
  //   {
  //     field: "fullName",
  //     headerName: "Full name",
  //     description: "This column has a value getter and is not sortable.",
  //     sortable: false,
  //     width: 160,
  //     valueGetter: (params) =>
  //       `${params.row.is_available || ""} ${params.row.price || ""}`,
  //   },
];

const rows = [
  { id: 1, time: "8am-9am", price: "300.000 VND", is_available: "true" },
  { id: 2, time: "9am-10am", price: "300.000 VND", is_available: "true" },
  { id: 3, time: "10am-11am", price: "300.000 VND", is_available: "true" },
  { id: 4, time: "11am-12pm", price: "300.000 VND", is_available: "false" },
  {
    id: 5,
    time: "12pm-1pm",
    price: "300.000 VND",
    is_available: "false",
  },
  { id: 6, time: "1pm-2pm", price: "300.000 VND", is_available: "false" },
  { id: 7, time: "2pm-3pm", price: "300.000 VND", is_available: "false" },
  { id: 8, time: "3pm-4pm", price: "300.000 VND", is_available: "true" },
  { id: 9, time: "4pm-5pm", price: "300.000 VND", is_available: "true" },
  { id: 10, time: "5pm-6pm", price: "300.000 VND", is_available: "false" },
  { id: 11, time: "6pm-7pm", price: "500.000 VND", is_available: "true" },
  { id: 12, time: "7pm-8pm", price: "500.000 VND", is_available: "true" },
  { id: 13, time: "8pm-9pm", price: "500.000 VND", is_available: "true" },
  { id: 14, time: "9pm-10pm", price: "500.000 VND", is_available: "false" },
];

export default function DataTable() {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        // pageSize={5}
        // rowsPerPageOptions={[5]}
        // checkboxSelection
      />
    </div>
  );
}
