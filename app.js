const json2html = require("node-json2html");
const https = require("https");
const express = require("express");
const app = express();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}
app.listen(port);

function onReport(_, res) {
  https
    .get("https://give.imb.org/api/projects", resp => {
      let data = "";

      resp.on("data", chunk => {
        data += chunk;
      });

      resp.on("end", () => {
        const d = JSON.parse(data);
        const filtered = d.filter(x => x.lmcid == "F9LMC120180200");
        d.map(x => {
          x.totalgifts = x.totalgifts.toFixed(2);
        });
        d.map(x => {
          x.refreshdate = new Date().toISOString();
        });

        const transform = {
          "<>": "div",
          html: [
            { "<>": "h1", text: "${title}" },
            { "<>": "h2", text: "${lmcid}" },
            {
              "<>": "p",
              text:
                "$${totalgifts} raised Online by ${unique-generosity-donors-count} Givers"
            },
            { "<>": "i", text: "Refreshed on  ${refreshdate}" }
          ]
        };

        const html = json2html.transform(filtered, transform);

        res.send(html);
      });
    })
    .on("error", err => {
      console.log("Error: " + err.message);
    });
}

app.get("/F9LMC120180200", onReport);
