import { extract } from '@extractus/feed-extractor';

// extract a RSS
const result = await extract('https://blog.0x32.co.uk/index.xml');
console.log(result.entries.length);
let lastDate = Date.parse("2023-11-03T15:58:16.000Z");
for (let post = 0; post < 10; post++){
  const postDate = Date.parse(result.entries[post].published);
  console.log(result.entries[post].title);
  console.log(result.entries[post].description);
  console.log(result.entries[post].link);
  if (postDate > lastDate) {console.log("New");}
}
