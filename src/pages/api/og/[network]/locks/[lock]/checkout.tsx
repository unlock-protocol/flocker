import type { NextApiRequest, NextApiResponse } from "next";
import { createCheckoutURL } from "../../../../../../utils";
import { Buffer } from "buffer";

const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY!;

const TwitterProfileHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const lock = req.query.lock?.toString();
  const network = Number(req.query.network?.toString());
  const endpoint = new URL("https://chrome.browserless.io/screenshot");
  endpoint.searchParams.append("token", BROWSERLESS_API_KEY);

  if (!(lock && network)) {
    return res.status(404).send({
      message: "Not found",
    });
  }

  const checkout = createCheckoutURL({ lock, network });
  const body = {
    url: checkout,
    options: {
      type: "jpeg",
      fullPage: true,
      quality: 75,
    },
    gotoOptions: {
      waitUntil: "networkidle0",
    },
    viewport: {
      height: 900,
      width: 1200,
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

  return res.setHeader("content-type", "image/jpeg").send(buffer);
};

export default TwitterProfileHandler;
