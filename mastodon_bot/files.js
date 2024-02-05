import path from "path";
import fs from "fs";
import { createRestAPIClient } from "masto";

function fromDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      fromDir(filename, filter);
    } else if (filename.endsWith(filter)) {
      console.log('-- found: ', filename);
      postImage(filename, "https://mastodon.me.uk/", process.env.TOKEN);
      const newPath = path.join("images_uploaded",path.basename(filename));
      fileMove(filename,newPath);
    }
  }
}

async function postImage(filename, instanceURL, token){
  const masto = createRestAPIClient({
    url: instanceURL,
    accessToken: token,
  });

  // Create media from a local file
  const attachment1 = await masto.v2.media.create({
    file: new Blob([fs.readFileSync(filename)]),
    description: "#dadjokes #dadjoke",
  });

  // Publish!
  const status = await masto.v1.statuses.create({
    status: "#dadjokes #dadjoke",
    visibility: "public",
    mediaIds: [attachment1.id],
  });

  console.log(status);
}

function fileMove(oldPath, newPath){
  fs.rename(oldPath, newPath, function (err) {
    if (err) throw err
    console.log('Successfully renamed - AKA moved!')
  })  
}

fromDir('./images', '.png');
