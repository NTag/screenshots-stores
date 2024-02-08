# screenshots-stores

This code aims to automate app screenshots capture and mockups creation.

It works as follow:

- You open your app in the simulator of your choice (usually either iPhone 8 Plus or iPhon 15 Pro Max to get the 5.5' and 6.7' screenshots Apple wants, for Android there are less constraints, I used a Pixel 3 emulator)
- The script exposes a webserver on localhost:3100/screenshot that when called take a screenshot of the simulator and save it in the screenshots folder
- The script will ask the simulator to open an URL, for example yourappdev:///screenshots
- The app must prepared to received this url (for example with expo-linking). When it does, the idea is that it configures itself with nice data and then navigate to different screens that should be screenshoted. When in a state that should be screenshoted, the app should call the webserver to take the screenshot: `fetch('http://localhost:3100/screenshot')`
- Once the app has done asking for all the screenshots, it can call `fetch('http://localhost:3100/end')` to tell the script that it's done
- Then the second part of the script enters in action and create mockups from the screenshots.
- Using the canvas API, it loads a background of the right size, place the screenshot into it, add a title, and can add an optional frame on top of the screenshot

## Example of code in the app

```javascript
// When you want to ask for a screenshot
import { Dimensions, Platform } from "react-native";

import { locale } from "../locales";

export const screenshot = async ({ name }) => {
  const window = Dimensions.get("window");
  // Cause Android emulator can have a decimal screen size
  const screen = `${Math.floor(window.width)}x${Math.floo(window.height)}`;

  const query = {
    name,
    platform: Platform.OS,
    locale,
    screen,
  };

  const queryString = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join("&");

  // Note that on Android emulator 'localhost' may not work,
  // I had to put the local IP of my compute 192.168.…
  const url = `http://localhost:3100/screenshot?${queryString}`;

  await fetch(url, {
    method: "POST",
  });
};

export const end = async () => {
  await fetch("http://localhost:3100/end", {
    method: "POST",
  });
};
```

## Disclaimer

The code works, as I'm using it for myprep.app screenshots. However it’s still a WIP, meaning it’s not "ready to use". I advise you clone the project, read the code and adapts it to your needs. It’s not a library, it’s a script that you should understand and modify to fit your needs.

Also in assets you should put your own frames, backgrounds and titles you want on the screens. I left my material inside it but it’s just so you get examples.
