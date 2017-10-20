var fs = require('fs');

fs.readFile('C:/react/test.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var result = JSON.parse(data);
  console.log(result);

  console.log(result[0].tags.snabbt);
  console.log(result.length);

});