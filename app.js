const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");


const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/" , function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname ;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/46fc22c918";

    const options = {
        method: 'POST',
        auth: "mbargaedge:876d7e8a2add0451ac61812a7779f078-us17"

    }

    const request = https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + '/succes.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure.html",function(req,res){
    res.redirect("/");
});

// when deploying to heroku change Port number from 3000 to another number
app.listen( process.env.PORT || 3002 , function(){
    console.log("Server running on port 3000");
});
// api key
// 876d7e8a2add0451ac61812a7779f078-us17

// Unique id 46fc22c918