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
     <title>Nancy News Stories For Your Day</title>
     <link>http://www.nancynews.com</link>
     <description>Daily News with Nancy</description>
     <itunes:author>Nancy News</itunes:author>
     <image>
       <url>http://www.nancynews.com/logo.png</url>
       <title>Nancy News</title>
       <link>http://www.nancynews.com</link>
     </image>
     <item>
       <title>Pandas run loose</title>
       <description>Pandas escape from the SF Zoo due to activist
         interference</description>
       <link>http://www.nancynews.com/article/pandas-run-loose.html</link>
       <guid>http://www.nancynews.com/id/1234567891</guid>
       <enclosure length="187" type="audio/mpeg" url="http://nancynews.com/pandas.mp3"/>
       <media:content url="http://nancynews.com/jane_doe_intro.mp3" type="audio/mpeg"
         expression="sample" />
       <media:content url="http://nancynews.com/pandas.mp3" type="audio/mpeg" />
       <media:thumbnail url="http://nancynews.com/pandas.jpg"
         width="1000" height="1000" />
       <pubDate>Thu, 8 Jun 2018 09:10:00 GMT</pubDate>
       <itunes:duration>45</itunes:duration>
     </item>
     <item>
       <title>Celebrities headline relief efforts</title>
       <description>Stars are taking action to support those that lost their homes in
         wildfires by offering hands-on support</description>
       <link>http://www.nancynews.com/article/celebrities-headline-relief-efforts.html
         </link>
       <guid>http://www.nancynews.com/id/1234567892</guid>
       <enclosure length="145" type="audio/mpeg"
         url="http://nancynews.com/starrelief.mp3"/>
       <media:content url="http://nancynews.com/jane_doe_intro.mp3" type="audio/mpeg"
         expression="sample" />
       <media:group>
         <media:content url="http://nancynews.com/starrelief.mp3" type="audio/mpeg" />
         <media:content url="http://nancynews.com/starrelief.mp4" type="video/mp4" />
       </media:group>
       <media:credit scheme="urn:ebu" reporter="Jane Doe" />
       <media:thumbnail url="http://nancynews.com/celebrities_hurricane.jpg"
         width="1000" height="1000" />
       <pubDate>Thu, 8 Jun 2018 09:20:00 GMT</pubDate>
       <itunes:duration>30</itunes:duration>
     </item>
     <item>
       <title>Sabercats win it all!</title>
       <description>Sabercats fans celebrate again after 25 year drought!</description>
       <link>http://www.nancynews.com/article/sabercats-win-it-all.html</link>
       <guid>http://www.nancynews.com/id/1234567893</guid>
       <enclosure length="208" type="audio/mpeg" url="http://nancynews.com/sample.mp3"/>
       <media:group>
         <media:content url="http://nancynews.com/sabercats_4000.mp4" duration="129"
           type="video/mp4" bitrate="4096000" width="1920" height="1080"/>
         <media:content url="http://nancynews.com/sabercats_1500.mp4" duration="129"
           type="video/mp4" bitrate="1596000" width="960" height="540"/>
         <media:content url="http://nancynews.com/sabercats_400.mp4" duration="129"
           type="video/mp4" bitrate="496000" width="448" height="252"/>
         <media:content url="http://nancynews.com/sabercats.mp3" duration="129"
           type="audio/mp3" bitrate="128000" width="0" height="0"/>
       </media:group>
       <pubDate>Thu, 8 Jun 2018 11:03:00 GMT</pubDate>
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