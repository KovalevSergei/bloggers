import basicAuth from "express-basic-auth";

export default basicAuth({
  users: { admin: "qwerty" },
  challenge: true,
});
