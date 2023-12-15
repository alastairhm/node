# RSS

Post new RSS entries from a Feed to Mastodon

Edit the `settings.json` file for your RSS Feed, earliest post date and Mastodon instance.

```
docker build -t my-nodejs-app .
docker run -e TOKEN=<your api token> -v ${PWD}:/mnt --rm my-nodejs-app
```

The date in `settings.json` will be updated with the date of the last post tooted to Mastodon, so you can run it again from that point.
