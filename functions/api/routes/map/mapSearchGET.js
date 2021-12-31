const functions = require("firebase-functions");
const _ = require("lodash");
const statusCode = require("../../../constants/statusCode");
const responseMessage = require("../../../constants/responseMessage");
const request = require("request");
const util = require("../../../lib/util");
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { searchKeyword } = req.query;
  const {} = req.query;

  try {
    let hello;
    let list = await fetch(
      `https://apis.openapi.sk.com/tmap/pois?searchKeyword=${searchKeyword}`,
      {
        method: "GET",
        headers: {
          appKey: process.env.APP_KEY,
          "content-type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        hello = data.searchPoiInfo.pois.poi;
        return hello;
      });
    list = list.reduce((acc, o, index) => {
      if (index < 5) {
        acc.push({
          id: o.id,
          name: o.name,
          frontLat: o.frontLat,
          frontLon: o.frontLon,
          fullAddressRoad: o.newAddressList.newAddress[0].fullAddressRoad,
        });
      }

      return acc;
    }, []);

    res.status(statusCode.OK).send(
      util.success(statusCode.OK, "성공", {
        list,
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
    // client.release();
  }
};
