const functions = require("firebase-functions");
const _ = require("lodash");

module.exports = async (req, res) => {
  const { name } = req.body;
  const {} = req.query;
  if (!name)
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, "Not enough parameters."));

  let client;

  try {
    client = await db.connect(req);
    const user = await userSQL.addUser(client, name);
    res.status(statusCode.OK).send(
      util.success("OK", "READ_ALL_USERS_SUCCESS", {
        user,
      })
    );
  } catch (error) {
    functions.logger.error(
      `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`,
      `[CONTENT] ${error}`
    );
    console.log(error);
    res.status(500).json({ err: error, userMessage: error.message });
  } finally {
    client.release();
  }
};
