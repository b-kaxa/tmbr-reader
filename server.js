var http = require('http');
var fs = require("fs");
var url = require("url");
var querystring = require("querystring");

http.createServer(function (req, res) {

  fs.readFile("./index.html","UTF-8", function(err,data){
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var offset = querystring.parse(url.parse(req.url).query);
    console.log(offset['offset']);

    http.get({
      host:"api.tumblr.com",
      path:"/v2/blog/kzbandai.tumblr.com/posts/quote?api_key=hogehoge&offset=" + offset['offset']
    },function(clres){
      var posts = "";

      clres.on('data',function(chunk){
        posts += chunk;

      }).on("end",function(){
        posts = JSON.parse(posts);
        var text = "";

        if(!offset['offset']){
          for(i=0; i < posts.response.posts.length; i++){
            var post = posts.response.posts[i];
            text += "<div class='ui-body ui-body-a ui-corner-all' style='margin:20px;'><h3>No."+ (i+1) +"</h3><p>" + post.text + "</p></div>";
          }
        } else {
          for(i=0; i < posts.response.posts.length; i++){
            var post = posts.response.posts[i];
            text += "<div class='ui-body ui-body-a ui-corner-all' style='margin:20px;'><h3>No."+ (i+1+parseInt(offset['offset'])) +"</h3><p>" + post.text + "</p></div>";
          }
        }

        if(!offset['offset']){
          var offset_num = 20;
        } else {
          var offset_num = parseInt(offset['offset']) + 20;
        }
        res.end(data.replace("@@source@@",text).replace("@@offset_num@@",offset_num));
      });

    }).on("error",function(e){
      console.log("error");
    });
  });

}).listen(process.env.PORT || 8080);
