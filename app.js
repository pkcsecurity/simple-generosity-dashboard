const request = require("request-promise-native");
const express = require("express");
const app = express();

app.set("view engine", "ejs");

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

app.get("/:lmcid", async (req, res) => {
  try {
    const apiResp = await request({
      method: "GET",
      uri: "https://give.imb.org/api/projects",
      strictSSL: true,
      json: true
    });
    const proj = apiResp.find(x => x.lmcid === req.params.lmcid);
    res.render("index", {
      imageurl: proj.url,
      title: proj.title,
      goal: usdFormatter.format(proj.totalgoal),
      raised: usdFormatter.format(proj.totalgifts),
      percent: Math.floor((proj.totalgifts / proj.totalgoal) * 100),
      donorcount: proj["unique-generosity-donors-count"]
    });
  } catch (e) {
    console.error(`Error requesting Generosity API: ${e.message}`);
    res.status(500).send("Error retrieving project data!");
  }
});

app.listen(process.env.PORT || 8080);
