var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://52.166.12.116:3000/api/highscore');
xhr.responseType = 'json';
xhr.onload = function() {
var data = xhr.response;
if (data !== null) {
console.log(data); // Parsed JSON object
}
};
xhr.send(null);
