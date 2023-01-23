const http = require("https");

module.exports = {
  parse: async (lighthouseMobileURL, lighthouseDesktopURL, pageURL, userID) => {
    let lighthouseParsedResults = {};

    let req = http.get(lighthouseMobileURL, function (res) {
      let data = "",
        json_data;

      res.on("data", function (stream) {
        data += stream;
      });
      res.on("end", async function () {
        json_data = JSON.parse(data);

        let results = {
          performance: json_data["categories"]["performance"]["score"],
          accessibility: json_data["categories"]["accessibility"]["score"],
          "best-practices": json_data["categories"]["best-practices"]["score"],
          seo: json_data["categories"]["seo"]["score"],
        };

        lighthouseParsedResults["mobile"] = results;

        let req_desktop = http.get(lighthouseDesktopURL, function (res) {
          let data = "",
            json_data;

          res.on("data", function (stream) {
            data += stream;
          });
          res.on("end", async function () {
            json_data = JSON.parse(data);

            let results = {
              performance: json_data["categories"]["performance"]["score"],
              accessibility: json_data["categories"]["accessibility"]["score"],
              "best-practices":
                json_data["categories"]["best-practices"]["score"],
              seo: json_data["categories"]["seo"]["score"],
            };
            lighthouseParsedResults["desktop"] = results;
            lighthouseParsedResults["url"] = pageURL;
            const fs = require("fs");
            // the file is read synchronously in this example
            // you can read it asynchronously also
            let allResults;
            fs.readFile("./data.json", (err, data) => {
              allResults = JSON.parse(data);
            });
            allResults[userID] = lighthouseParsedResults
          });
        });

        req_desktop.on("error", function (e) {
          console.log(e.message);
        });
      });
    });

    req.on("error", function (e) {
      console.log(e.message);
    });
  },
};
