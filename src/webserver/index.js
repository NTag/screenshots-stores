import { createMockupForFile } from "../mockups/index.js";
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
  console.log("Taking screenshot:", path);

  if (platform === "android") {
    await exec(`adb -s emulator-5554 exec-out screencap -p > ${path}`);
  } else if (platform === "ios") {
    await exec(`xcrun simctl io booted screenshot ${path}`);
  } else {
    throw new Error("Unknown platform");
  }

  createMockupForFile(filename);

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
