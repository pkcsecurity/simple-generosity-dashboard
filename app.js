const request = require("request-promise-native");
const express = require("express");
const app = express();

app.set("view engine", "ejs");

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

async function loadPage(req, res, autoreload) {
  try {
    const apiResp = await request({
      method: "GET",
      uri: "https://give.imb.org/api/projects",
      strictSSL: true,
      json: true
    });
    const lmcid = req.params.lmcid;
    const proj =
      lmcid === "F9LMCO"
        ? apiResp.find(x => x.id === 122)
        : apiResp.find(x => x.lmcid === lmcid);
    res.render("index", {
      imageurl: proj.url,
      title: proj.title,
      goal: usdFormatter.format(proj.totalgoal),
      raised: usdFormatter.format(proj.totalgifts),
      percent: ((proj.totalgifts / proj.totalgoal) * 100).toFixed(2),
      donorcount: proj["unique-generosity-donors-count"],
      autoreload: autoreload
    });
  } catch (e) {
    console.error(`Error requesting Generosity API: ${e.message}`);
    res.status(500).send("Error retrieving project data!");
  }
}

app.get("/:lmcid", async (req, res) => loadPage(req, res, false));
app.get("/r/:lmcid", async (req, res) => loadPage(req, res, true));

app.listen(process.env.PORT || 8080);
