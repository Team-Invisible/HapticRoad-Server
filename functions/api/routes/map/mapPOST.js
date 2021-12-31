const functions = require("firebase-functions");
const _ = require("lodash");
const statusCode = require("../../../constants/statusCode");
const responseMessage = require("../../../constants/responseMessage");
const request = require("request");
const util = require("../../../lib/util");
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const {
    startX,
    startY,
    angle,
    speed,
    endPoiId,
    endX,
    endY,
    startName,
    endName,
    searchOption,
    resCoordType,
  } = req.body;
  const {} = req.query;

  // let client;

  try {
    // client = await db.connect(req);

    let pedestrian;
    let totalDistance;
    let totalTime;
    pedestrian = await fetch(
      "https://apis.openapi.sk.com/tmap/routes/pedestrian",
      {
        method: "POST",
        headers: {
          appKey: process.env.APP_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          startX,
          startY,
          angle,
          speed,
          endPoiId,
          endX,
          endY,
          startName,
          endName,
          searchOption,
          resCoordType,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        pedestrian = data.features.map((o, idx) => {
          if (o.geometry.type == "Point") {
            if (idx === 0) {
              totalDistance = o.properties.totalDistance;
              totalTime = o.properties.totalTime;
            }
            return {
              type: o.geometry.type,
              coordinates: o.geometry.coordinates,
              index: o.properties.index,
              pointIndex: o.properties.pointIndex,
              lineIndex: null,
              name: o.properties.name,
              description: o.properties.description,
              distance: null,
              time: null,
              direction: o.properties.direction,
              facilityType: o.properties.facilityType,
              facilityName: o.properties.facilityName,
              turnType: o.properties.turnType,
            };
          } else if (o.geometry.type == "LineString") {
            let coordinates = o.geometry.coordinates;
            if (coordinates.length >= 2) {
              coordinates = [
                ...coordinates[0],
                ...coordinates[coordinates.length - 1],
              ];
            }

            return {
              type: o.geometry.type,
              coordinates: coordinates,
              index: o.properties.index,
              pointIndex: null,
              lineIndex: o.properties.lineIndex,
              name: o.properties.name,
              description: o.properties.description,
              distance: o.properties.distance,
              time: o.properties.time,
              direction: null,
              facilityType: o.properties.facilityType,
              facilityName: o.properties.facilityName,
              turnType: null,
            };
          }
        });

        return pedestrian;
      });

    res.status(statusCode.OK).send(
      util.success(statusCode.OK, "성공", {
        pedestrian,
        totalDistance,
        totalTime,
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
