import {
  startWebServer,
  waitForScreenshotsToEnd,
} from "./src/webserver/index.js";

import { createMockups } from "./src/mockups/index.js";
import { exec } from "./src/helpers/exec.js";

const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const start = async (platform) => {
  await startWebServer();

  // await exec(
  //   `npx uri-scheme open "exp://172.20.10.2:8081/--/screenshots" --${platform}`
  // );

  // await waitForScreenshotsToEnd();

  // console.log("Set FR locale");
  // await exec(
  //   `npx uri-scheme open "myprepdev:///locale?locale=fr" --${platform}`
  // );
  // await waitFor(3_000);
  // console.log("Take screenshots for FR");
  // await exec(`npx uri-scheme open "myprepdev:///screenshots" --${platform}`);
  // await waitForScreenshotsToEnd();
  // console.log("Screenshots for FR are done");

  // console.log("Set EN locale");
  // await exec(
  //   `npx uri-scheme open "myprepdev:///locale?locale=en" --${platform}`
  // );
  // await waitFor(3_000);
  // console.log("Take screenshots for EN");
  // await exec(`npx uri-scheme open "myprepdev:///screenshots" --${platform}`);
  // await waitForScreenshotsToEnd();
  // console.log("Screenshots for EN are done");

  // console.log("Set DE locale");
  // await exec(
  //   `npx uri-scheme open "myprepdev:///locale?locale=de" --${platform}`
  // );
  // await waitFor(3_000); // bug with the metro banner
  // console.log("Take screenshots for DE");
  // await exec(`npx uri-scheme open "myprepdev:///screenshots" --${platform}`);
  // await waitForScreenshotsToEnd();
  // console.log("Screenshots for DE are done");

  // console.log("Create mockups");
  // await createMockups();
  // console.log("Mockups are created");
};

await start("ios");
// await createMockups();
// process.exit(0);
