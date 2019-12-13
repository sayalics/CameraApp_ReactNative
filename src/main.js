var fs = require("fs");
var request = require("request");

const options = {
    method: "POST",
    url: "http://34.93.51.153/images",
    headers: {
        "Content-Type": "multipart/form-data"
    },
    formData : {
        "image" : fs.createReadStream("/home/omiee/Desktop/projects/folder1/pan_api/om_pan.jpg")
    }
};

request(options, function (err, res, body) {
    if(err) console.log(err);
    console.log(body);
});