import axios from "axios";

const options = {
  method: 'patch',
  url: 'http://localhost:3000/api/comments/697b023604b6cbc20fba4d17',
  headers: {
    Accept: '*/*',
    'User-Agent': 'Flashpost',
    'Content-Type': 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NzlmOTBlYzI1ZDY0M2JmMmZiYjM0OCIsImlhdCI6MTc2OTc0ODc1NSwiZXhwIjoxNzY5NzQ5NjU1fQ.hIqB94ZpNIY51pm0GO9B3pbYGTL30xp8ksWHjW6IR4E'
  },
  data: {text: 'nice dfs'}
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});