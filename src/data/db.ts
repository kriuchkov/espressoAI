import { SQL } from "bun";

const db = new SQL({
  url: process.env.DATABASE_URL || "",

  onconnect: () => {
    console.log("Connected to database");
  },
  onclose: () => {
    console.log("Connection closed");
  },
});

export default db;