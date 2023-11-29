// Import the got module
import got from 'got';

const apiUrl = "https://icanhazdadjoke.com/";

// Make a GET request to the API URL using the got module
got.get(apiUrl, { responseType: 'json' })
  .then(response => {
    // If the request is successful, parse the response body as a JSON object
    const data = response.body;

    console.log(data);
  })
  .catch(error => {
    // If the request fails, print out the error message
    console.error(error.message);
  });
