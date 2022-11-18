import { app } from "./config/app";

interface ScreenshotOptions {
  url: string;
  height?: number;
  width?: number;
}

export async function screenshot({
  url,
  width = 1200,
  height = 700,
}: ScreenshotOptions) {
  const endpoint = new URL("https://chrome.browserless.io/screenshot");
  endpoint.searchParams.append("token", app.browserLessAPIKey);

  const body = {
    url,
    options: {
      type: "jpeg",
      fullPage: true,
      quality: 75,
    },
    gotoOptions: {
      waitUntil: "networkidle0",
    },
    viewport: {
      height,
      width,
    },
  };

  const response = await fetch(endpoint.toString(), {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const blob = await response.blob();

  const arrayBuffer = await blob.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  return buffer;
}
