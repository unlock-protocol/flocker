import type { NextApiRequest, NextApiResponse } from "next";
import { app } from "../../config/app";
import { screenshot } from "../../handlers";

const TwitterProfileHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const url = req.query.url?.toString();

  if (!url) {
    return res.status(404).send({
      message: "Not found",
    });
  }

  const buffer = await screenshot({
    url,
  });

  return res.setHeader("content-type", "image/jpeg").send(buffer);
};

export default TwitterProfileHandler;
