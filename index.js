"use strict";

const conf = require("./conf.js")
const cmd = require("node-cmd")

const PORT = process.env.PORT || 8080
const SECRET = conf.secret;
const REPO = conf.repo;
const URL_PATH = conf.urlPath

const http = require("http")
const createHandler = require("github-webhook-handler")
const handler = createHandler({
  path: URL_PATH,
  secret: SECRET
})


http.createServer((req, res) => {
  handler(req, res, (err) => {
    console.log("error");
    res.statusCode = 404
    res.end("no such location")
  })
}).listen(PORT)


handler.on("error", (err) => {
  console.error("Error:", err.message)
})


handler.on("push", (event) => {
  const payload = event.payload
  const repoName = payload.repository.name
  const branch = payload.ref.split("/").pop()
  console.log("Pushed");
  if (repoName === REPO && branch === "master") {
    cmd.get(`cd ${conf.dir} && git pull`, (e, d, se) => {
      console.log(d ? d : "");
      console.log(e ? e : "");
      console.log(se ? se : "");
    });
  }
});
