import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Alert from "@mui/material/Alert";
import { getAlertSeverity } from "../utils";

const Orders = () => {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:4000/orders");
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching Orders:", error);
    }
  };

  // Fetch orders when the modal opens
  const handleOpen = () => {
    fetchOrders();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseClick = async (orderId) => {
    console.log("Open Confirmation Box :", orderId)
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Orders
      </Button>

      <Modal open={open} onClose={handleClose}>
        <div
          style={{
            padding: 20,
            backgroundColor: "white",
            borderRadius: 8,
            maxWidth: 1000,
            margin: "auto",
            marginTop: "10%",
          }}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Amount&nbsp;(Rs.)</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.qty} x {item.name}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>{order.price}</TableCell>
                    <TableCell>
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Alert severity={getAlertSeverity(order.status)}>
                        {order.status}
                      </Alert>
                    </TableCell>
                    <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleCloseClick(order.orderId)}
                      aria-label="cancel"
                    >
                      <CancelIcon />
                    </IconButton>
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClose}
            style={{ marginTop: 20 }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Orders;
