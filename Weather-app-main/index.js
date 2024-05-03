const express = require('express');
const axios = require('axios');
require('dotenv').config();

const path = require('path');



const app = express();
const port = 3000;

const API_KEY = process.env.API_KEY;
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.json());




// Define a route for the root path of the application
app.get('/', (req, res) => {

  const address = req.query.address; // Read the address query parameter from the request
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${address}&units=metric&appid=${API_KEY}`;
  

  // Make an HTTP GET request to the API using axios
  axios.get(url)
    .then(response => {
      const data = response.data;
      const cityName = data.name;
      const temperature = data.main.temp;
      const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
      const message = `City Name: ${cityName}<br>Temperature: ${temperature}&deg;C<br>Sunset Time: ${sunsetTime}`;
      

      res.send(`<html><body style="text-align:center;"><div id='container'><h1>${message}</h1></div></body></html>`);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error occurred while fetching weather data');
    });
});

app.get("/",(req,res)=>
{
  res.render("index");
})


// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
