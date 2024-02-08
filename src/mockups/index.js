import { createMockup } from "./create.js";
import fs from "fs/promises";
import { mockupsTitles } from "../../assets/titles.js";
import sharp from "sharp";

export const createMockups = async () => {
  const screenshots = await fs.readdir("./screenshots");

  const backgroundAndroidBuffer = await fs.readFile("./assets/bg-android.png");
  const background55Buffer = await fs.readFile("./assets/bg-s55.png");
  const background67Buffer = await fs.readFile("./assets/bg-s67.png");
  const frame67Buffer = await fs.readFile("./assets/frame-s67.png");

  const backgroundAndroidMetadata = await sharp(
    backgroundAndroidBuffer
  ).metadata();
  const background55Metadata = await sharp(background55Buffer).metadata();
  const background67Metadata = await sharp(background67Buffer).metadata();
  const frame67Metadata = await sharp(frame67Buffer).metadata();

  const resolutionsMapping = {
    ios: {
      "430x932": {
        background: {
          buffer: background67Buffer,
          height: background67Metadata.height,
          width: background67Metadata.width,
        },
        frame: {
          buffer: frame67Buffer,
          position: { x: 128, y: 427 },
          height: frame67Metadata.height,
          width: frame67Metadata.width,
          radius: 128,
          border: 10,
        },
        title: {
          x: background67Metadata.width / 2,
          y: 427 / 2,
          width: background67Metadata.width - 128,
        },
        screenshot: {
          height: frame67Metadata.height - 20,
          width: frame67Metadata.width - 20,
          position: { x: 128 + 10, y: 427 + 10 },
          radius: 128,
        },
        font: {
          size: 70,
          height: 120,
        },
      },
      "375x667": {
        background: {
          buffer: background55Buffer,
          height: background55Metadata.height,
          width: background55Metadata.width,
        },
        title: {
          x: background55Metadata.width / 2,
          y: 368 / 2,
          width: background55Metadata.width - 64,
        },
        screenshot: {
          height: 1362,
          width: 766,
          position: { x: 237, y: 571 },
        },
        font: {
          size: 65,
          height: 100,
        },
      },
    },
    android: {
      "392x783": {
        background: {
          buffer: backgroundAndroidBuffer,
          height: backgroundAndroidMetadata.height,
          width: backgroundAndroidMetadata.width,
        },
        title: {
          x: backgroundAndroidMetadata.width / 2,
          y: 427 / 2,
          width: backgroundAndroidMetadata.width - 64,
        },
        screenshot: {
          height: 1959,
          width: 953,
          position: { x: 168, y: 568 },
          radius: 32,
        },
        font: {
          size: 65,
          height: 100,
        },
      },
    },
  };

  for (const screenshot of screenshots) {
    const [platform, lang, dimensions, name] = screenshot
      .replace(".png", "")
      .split("_");
    const params = resolutionsMapping[platform]?.[dimensions];
    const title = mockupsTitles[name]?.[lang];
    if (!params || !title) {
      continue;
    }

    console.log("Creating mockup for", screenshot);

    const screenshotBuffer = await fs.readFile(`./screenshots/${screenshot}`);

    await createMockup({
      ...params,
      title: {
        ...params.title,
        text: title,
      },
      screenshot: {
        ...params.screenshot,
        buffer: screenshotBuffer,
      },
      destination: `./mockups/${screenshot}`,
    });
  }
};
