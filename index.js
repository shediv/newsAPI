var express = require('express');
var request = require("request");
const article = require('article');
const bodyParser = require('body-parser')
const Feed = require('feed').Feed;
var feedster = require('feed-generator');
var async = require('async');
var app = express();

this.params = {};
var self = this;
var envConfig = require('./app/env');
console.log(" envConfig = ", envConfig.newsAPI)

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function(request, response, next){
  console.log(  "\033[34m \033[1m" + request.method , 
                "\033[36m \033[1m REQUEST URL: " + "\033[32m "+request.url , 
                "\033[36m \033[1m REQUEST TIME: " + "\033[32m "+ new Date() + "\033[31m ");
  next();
});

app.use(express.static("./app"));

app.get("/", function(req, res) {
    res.sendFile("./app/index.html");
});

app.get("/google1f90687b77368bc0.html", function(req, res) {
  res.sendFile(__dirname + '/google1f90687b77368bc0.html');
});

app.get("/google76afafe39ef3304f.html", function(req, res) {
  res.sendFile(__dirname + '/google76afafe39ef3304f.html');
});

// https://trending-news-v.herokuapp.com/file-1552915152824.mp3
app.get("/file-1552915152824.mp3", function(req, res) {
  res.sendFile(__dirname + '/file-1552915152824.mp3');
});

//rss feed
app.get("/test", function(req, res) {
  let topNews = [];
  //Get the top 5 news articles
  request(envConfig.herokuURL+'/topNews?country=IN', function (error, response) {
    if(error){
      return res.status(500).json({'error': error})
    }else{
      var articleBody = JSON.parse(response.body);
      articleBody.articles.forEach(e => {
        topNews.push(e);
      });

      var feed = feedster.createFeed({
          title: 'Top news of India'
      });

      async.each(topNews, function(news, callback) {
        // Configure the request
        request(news.url).pipe(article(news.url, function (errS, summary) {
          feed.addItem({
              id: news.author+new Date(),
              title: news.title,
              //link: news.url,
              description: news.description,
              content: summary.text,
              pubDate: news.publishedAt
          })
          callback()  
        }));

      }, function(err) {
          var rss = feed.render({indent: '  '});
          return res.type('application/xml').send(rss);
      });
    }
  });
});

//New feeds
app.get("/feeds", function(req, res){

  let topNews = [];
  //Get the top 5 news articles
  request(envConfig.herokuURL+'/topNews?country=IN', function (error, response) {
    if(error){
      return res.status(500).json({'error': error})
    }else{
      var articleBody = JSON.parse(response.body);
      articleBody.articles.forEach(e => {
        topNews.push(e);
      });

      const feed = new Feed({
        title: 'Top news in India',
        description: 'This page will show you top news in India',
        id: 'http://13.250.77.198:5000/feeds',
        link: 'http://13.250.77.198:5000/feeds',
        language: "en", 
        updated: new Date(), // optional, default = today
      });
      //const feed = new Feed();
      topNews.forEach(news => {
        feed.addItem({
          title: news.title,
          id: news.url,
          link: news.url,
          description: news.description,
          content: news.content,
          date: new Date()
          //image: news.urlToImage
        });
      });
           
      feed.addCategory("News");
      //console.log(feed.rss2())
      return res.type('application/xml').send(feed.rss2());
    }
  });
})

app.get("/news-feeds", function(req, res){
  let countryCode = req.query.country ? req.query.country : 'IN';
  var newsAPIUrl = envConfig.newsAPI+'?country='+countryCode+'&pageSize='+envConfig.newsPageSize+'&apiKey='+envConfig.newsAPIKey;
  let topNews = [];
  // Configure the request
  var options = {
    url: newsAPIUrl,
    method: 'GET'
  }
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var articleBody = JSON.parse(body);
        //var articleBody = JSON.parse(response.body);
        articleBody.articles.forEach(e => {
          topNews.push(e);
        });

        var feed = feedster.createFeed({
            title: 'Top news of '+countryCode
        });

        async.each(topNews, function(news, callback) {
          // Configure the request
          request(news.url).pipe(article(news.url, function (errS, summary) {
            feed.addItem({
                id: news.author+new Date(),
                title: news.title,
                description: news.description,
                content: summary ? summary.text : '',
                pubDate: news.publishedAt,
                image: summary ? summary.image : ''
            })
            callback()  
          }));

        }, function(err) {
            var rss = feed.render({indent: '  '});
            return res.type('application/xml').send(rss);
        });
    }else{
      return res.status(500).json({'error': error})
    }
  })
})

app.get("/mrss", function(req, res){
  var mrss = `
  <rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
       xmlns:media="http://search.yahoo.com/mrss/"
       version="2.0">
    <channel>
     <title>Developer News</title>
     <link>https://trending-news-v.herokuapp.com</link>
     <description>Developer News Daily</description>
     <itunes:author>Developer News</itunes:author>
     <image>
       <url>https://cdn.stocksnap.io/img-thumbs/960w/FU5O3YEFX5.jpg</url>
       <title>Developer News</title>
       <link>https://trending-news-v.herokuapp.com</link>
     </image>
     <item>
       <title>Pandas run loose</title>
       <description>Pandas escape from the SF Zoo due to activist
         interference</description>
       <link>https://trending-news-v.herokuapp.com/mrss</link>
       <guid>https://trending-news-v.herokuapp.com/mrss/1234567891</guid>
       <enclosure length="187" type="audio/mpeg" url="https://trending-news-v.herokuapp.com/file-1552915152824.mp3"/>
       <media:content url="https://trending-news-v.herokuapp.com/file-1552915152824.mp3" type="audio/mpeg"
         expression="sample" />
       <media:content url="https://trending-news-v.herokuapp.com/file-1552915152824.mp3" type="audio/mpeg" />
       <media:thumbnail url="https://trending-news-v.herokuapp.com/file-1552915152824.mp3"
         width="1000" height="1000" />
       <pubDate>Thu, 8 Jun 2018 09:10:00 GMT</pubDate>
       <itunes:duration>45</itunes:duration>
     </item>
    </channel>
  </rss>`
  return res.type('application/xml').send(mrss);
})

//Get top 5 news from country.
app.get("/topNews", function(req, res) {
  var newsAPIUrl = envConfig.newsAPI+'?country='+req.query.country+'&pageSize='+envConfig.newsPageSize+'&apiKey='+envConfig.newsAPIKey;
  // Configure the request
  var options = {
    url: newsAPIUrl,
    method: 'GET'
  }
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var body = JSON.parse(body);
        return res.status(200).json({'articles': body.articles})
    }else{
      return res.status(500).json({'error': error})
    }
  })
});

//Get Article Details.
app.get("/articleDetails", function(req, res) {
  //var diffBotAPIUrl = envConfig.diffBotAPI+'?token='+envConfig.diffBotAPIToken+'&url='+req.query.url;
  // Configure the request
  request(req.query.url).pipe(article(req.query.url, function (err, result) {
	  if (err) return res.status(500).json({'error': error});
	  return res.status(200).json({text: result.text});
	}));
});

//Get Summary of text.
app.post("/summary", function(req, res) {
  // Set the headers
  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
    'Api-Key': envConfig.deepaiAPIKey
  }

  // Configure the request
  var options = {
    url: envConfig.deepaiAPI,
    method: 'POST',
    headers: headers,
    form: { text: req.body.text },
  }

  // Start the request
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var summary = JSON.parse(body);
        return res.status(200).json({'summary': summary.output})
    }else{
      return res.status(500).json({'error': error})
    }
  })
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});