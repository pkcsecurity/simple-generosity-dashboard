const json2html = require('node-json2html');
const https = require('https');
const express = require('express')
const app = express()

app.set('view engine', 'pug')

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

function onReport(req, res) {
  https.get('https://give.imb.org/api/projects', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      const d = JSON.parse(data);
      const filtered = d.filter(x => x.lmcid == "F9LMC120180200");
      const formatterd = d.map(x => { x.totalgifts = x.totalgifts.toFixed(2); });

      const transform = {'<>':'div','html':[
        {'<>':'h1','text':'${title}'},
        {'<>':'h2','text':'${lmcid}'},
        {'<>':'p','text':'$${totalgifts} raised Online by ${unique-generosity-donors-count} Givers'}
      ]};

      const html = json2html.transform(filtered,transform);

      res.send(html)
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

app.get('/F9LMC120180200', onReport);
