import type { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);
const readOnlyClient = twitterClient.readOnly;

const TwitterProfileHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const username = req.query.username?.toString();
  if (!username) {
    return res.status(400).send({
      message: "No username provided",
    });
  }

  const response = await readOnlyClient.v2.userByUsername(username, {
    "user.fields": [
      "description",
      "name",
      "location",
      "profile_image_url",
      "id",
      "url",
      "created_at",
    ],
  });

  if (response.errors) {
    return res.status(400).send({
      errors: response.errors,
    });
  }

  return res.status(200).json(response.data);
};

export default TwitterProfileHandler;
