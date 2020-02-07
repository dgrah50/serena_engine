const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./middleware/firebase-admin/admin");
const routes = require("./routes");
const middleware = require("./middleware");
const {init} = require("./services/verses");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", middleware);
app.use("/api", routes);


//Calls init function on server start
app.listen(8000, () => {
  init();
});
