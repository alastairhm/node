import { extract } from "@extractus/feed-extractor";
import { createRestAPIClient } from "masto";
import * as fs from "fs";

async function postToot(myPost, url) {
  const newStatus = myPost + " #blog";
  console.log("Post,", myPost);
  const masto = createRestAPIClient({
    url: url,
    accessToken: process.env.TOKEN,
  });
  const status = await masto.v1.statuses.create({
    status: newStatus,
    visibility: "public",
  });
  console.log(status.url);
}

function readParameters(path) {
  let json = JSON.parse(fs.readFileSync(path, "utf8"));
  return json;
}

// extract a RSS
let config = readParameters("./settings.json");
const result = await extract(config.rss_feed);
console.log("Posts Found:", result.entries.length);
let lastDate = new Date(config.last_post);
console.log("Last Date:", lastDate);
for (let post = config.previous; post >= 0; post--) {
  let postDate = new Date(result.entries[post].published);
  console.log(postDate);
  if (postDate > lastDate) {
    let buffer = result.entries[post].title;
    buffer = buffer + "\n" + result.entries[post].link;
    buffer = buffer + "\n" + result.entries[post].description;
    buffer = buffer.substring(0, 450);
    postToot(buffer, config.mastodon_url);
    config.last_post = postDate.toISOString();
    fs.writeFile(
      "./settings.json",
      JSON.stringify(config),
      "utf8",
      function (err) {
        if (err) {
          return console.log(err);
        }
      },
    );
  }
}
