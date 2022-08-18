// const fs = require('../posts/test_JSON_file.json');
fetch('../posts/test_JSON_file.json')
.then(response => {
	return response.json();
})
.then(jsondata => console.log(jsondata));

// console.log(fs);