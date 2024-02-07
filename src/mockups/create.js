import { Canvas, Image } from "@napi-rs/canvas";

import fs from "fs/promises";

const wrapTextAndCenter = (ctx, text, font, xCenter, yCenter, maxWidth) => {
  ctx.font = `bold ${font.size}pt SF Pro Display`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const lineHeight = font.height;

  const words = text.split(" ");
  let line = "";
  const lines = [];

  words.forEach((word) => {
    const testLine = line + word;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && line !== "") {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine + " ";
    }
  });

  lines.push(line); // Add the last line

  let y = yCenter - (lines.length * lineHeight) / 2;

  // Center and draw the text
  lines.forEach((line, i) => {
    ctx.fillText(line, xCenter, y);
    y += lineHeight; // Move to the next line position
  });
};

const drawRoundedImage = (ctx, img, x, y, width, height, borderRadius) => {
  ctx.save();

  ctx.beginPath();
  // Start at the top left corner and create the rounded rect path
  ctx.moveTo(x + borderRadius, y);
  ctx.lineTo(x + width - borderRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
  ctx.lineTo(x + width, y + height - borderRadius);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - borderRadius,
    y + height
  );
  ctx.lineTo(x + borderRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
  ctx.lineTo(x, y + borderRadius);
  ctx.quadraticCurveTo(x, y, x + borderRadius, y);
  ctx.closePath();

  // Clip to the rounded rectangle path
  ctx.clip();

  // Draw the image
  ctx.drawImage(img, x, y, width, height);

  // Clear the path and reset the clip
  ctx.restore();
};

export const createMockup = async ({
  screenshot: {
    buffer: screenshotBuffer,
    height: sHeight,
    width: sWidth,
    position: { x: sx, y: sy },
    radius: sRadius,
  },
  title: { text, x: xTitle, y: yTitle, width: widthTitle },
  background: { buffer: bgBuffer, height: bgHeight, width: bgWidth },
  frame,
  destination,
  font,
}) => {
  const canvas = new Canvas(bgWidth, bgHeight);
  const context = canvas.getContext("2d");

  const backgroundImage = new Image();
  backgroundImage.width = bgWidth;
  backgroundImage.height = bgHeight;
  backgroundImage.src = bgBuffer;
  context.drawImage(backgroundImage, 0, 0, bgWidth, bgHeight);

  const screenshotImage = new Image();
  screenshotImage.width = sWidth;
  screenshotImage.height = sHeight;
  screenshotImage.src = screenshotBuffer;
  if (sRadius) {
    drawRoundedImage(
      context,
      screenshotImage,
      sx,
      sy,
      sWidth,
      sHeight,
      sRadius
    );
  } else {
    context.drawImage(screenshotImage, sx, sy, sWidth, sHeight);
  }

  if (frame) {
    const {
      buffer: fBuffer,
      position: { x, y },
      height: fHeight,
      width: fWidth,
    } = frame;
    const frameImage = new Image();
    frameImage.width = fWidth;
    frameImage.height = fHeight;
    frameImage.src = fBuffer;
    context.drawImage(frameImage, x, y, fWidth, fHeight);
  }

  wrapTextAndCenter(context, text, font, xTitle, yTitle, widthTitle);

  await fs.writeFile(
    destination.replace(".png", ".jpg"),
    canvas.toBuffer("image/jpeg")
  );
};
