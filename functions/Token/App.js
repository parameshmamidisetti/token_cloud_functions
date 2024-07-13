const functions = require("firebase-functions");
const Razorpay = require("razorpay");
const cors = require("cors");
var express = require("express");
// const usb = require("usb");
// const webusb = require("usb");
const admin = require("firebase-admin");
admin.initializeApp();
// usb.useUsbDkBackend();
const app = express();
app.use(cors({ origin: true, credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/getOrderId", async (req, res) => {
  const amount = req.body.amount;
  const receipt = req.body.receipt;
  var options = {
    amount: amount,
    currency: "INR",
    receipt: receipt,
  };
  var instance = new Razorpay({
    key_id: "rzp_live_BnsqliiOrymap2",
    key_secret: "P0jjEMnO9KLDw1o2AXwiQTGJ",
  });

  var order = await instance.orders.create(options);
  res.send(order);
});
// Function to parse custom date format
function parseDate(dateString) {
  // Example input: 2024-06-25 00:01:52.123417
  const [datePart, timePart] = dateString.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  const milliseconds = (parseFloat(seconds) % 1) * 1000;
  const date = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    Math.floor(seconds),
    milliseconds
  );
  return date;
}

app.get("/getShopOrders/:shopId", async (req, res) => {
  try {
    const shopId = req.params.shopId; // Extract shopId from the request path

    const db = admin.firestore();

    // First go to shop collection then inside doc shopId then go to shopOrders collection
    const shopOrderRef = db
      .collection("shop")
      .doc(shopId)
      .collection("shopOrders");

    const snapshot = await shopOrderRef.get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      res.status(404).send("Not Found");
    } else {
      // Send array of shopOrders
      const shopOrders = snapshot.docs.map((doc) => doc.data());
      res.send(shopOrders);
    }
  } catch (error) {
    console.error("Error fetching shop order: ", error);
    res.status(500).send(error.toString());
  }
});

module.exports = app;
