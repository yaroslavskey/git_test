const http = require('http');
const axios = require('axios');
const url = require('url');


const PORT = 3000;
const HOST = 'localhost';

const server = http.createServer((request, response) => {
  console.log(`Server request`);

  let urlCurrency;
  if (request.method == `GET`) {
    let urlRequest = url.parse(request.url, true);
    urlCurrency = urlRequest.query.currency;
    console.log(urlCurrency);
  }

  const сurrency = ["bitcoin", "ethereum", "ripple", "bitcoin-cash"];
  let index = сurrency.indexOf(urlCurrency);
  if (index < 0) {
    response.statusCode = 404;
    response.write("Not found");
    response.end();
  }

  let rate;
  axios
    .get('https://api.coincap.io/v2/rates/' + urlCurrency)
    .then(res => {
      console.log(`statusCode: ${res.status}`);
      rate = res.data.data;

      let data = JSON.stringify({
        usd: rate.rateUsd
      });

      response.setHeader(`Content-Type`, `application/json`);
      if (request.method == `GET`) {
        response.write(data);
      }
      response.end();
    })
    .catch(error => {
      console.error(error);
    });
});

server.listen(PORT, HOST, (error) => {
  error ? console.log(`error`) : console.log(`listening port ${PORT}`)
});

