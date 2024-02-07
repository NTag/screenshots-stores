import { exec } from "../helpers/exec.js";
import express from "express";

const PORT = 3100;
const app = express();

let endPromise, endPromiseResolve;

export const waitForScreenshotsToEnd = () => {
  if (endPromise) {
    return endPromise;
  }

  endPromise = new Promise((resolve) => {
    endPromiseResolve = resolve;
  });

  return endPromise;
};

app.post("/screenshot", async (req, res) => {
  const { name, platform, locale, screen } = req.query;

  const filename = `${platform}_${locale}_${screen}_${name}.png`;
  const path = `./screenshots/${filename}`;

  if (platform === "android") {
    throw new Error("Not implemented");
  }

  console.log("Taking screenshot:", path);
  await exec(`xcrun simctl io booted screenshot ${path}`);

  res.sendStatus(200);
});

app.post("/end", async (req, res) => {
  if (endPromiseResolve) {
    endPromiseResolve();
    endPromiseResolve = null;
    endPromise = null;
  }

  res.sendStatus(200);
});

export const startWebServer = () => {
  return new Promise((resolve, reject) => {
    app.listen(PORT, () => {
      console.log(`screenshots-stores listening on port ${PORT}`);
      resolve();
    });
  });
};
