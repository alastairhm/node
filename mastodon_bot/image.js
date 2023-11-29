import fs from "node:fs";

import { createRestAPIClient } from "masto";

const masto = createRestAPIClient({
  url: "https://mastodon.me.uk/",
  accessToken: process.env.TOKEN,
});

// Create media from a local file
const attachment1 = await masto.v2.media.create({
  file: new Blob([fs.readFileSync("some_image.jpg")]),
  description: "Some image",
});

// Publish!
const status = await masto.v1.statuses.create({
  status: "Hello from #mastojs!",
  visibility: "public",
  mediaIds: [attachment1.id],
});

console.log(status);
