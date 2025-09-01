import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import dbConnect from '../src/Config/dbConfig.js';
import admin from '../src/Routes/admin.routes.js';
import user from '../src/Routes/employee.routes.js';
import dotenv from 'dotenv'

const app = express();
const port = 3000;

dotenv.config();


app.use(cors());


app.use(express.json());


app.use("/api/admin/", admin);
app.use("/api/user/", user);


dbConnect()
  .then(() => {
    console.log("Db Connected Successfully");
  })
  .catch(() => {
    console.log("Something went wrong while connecting to the db");
  });

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
