var express = require('express');
var request = require("request");
const article = require('article');
const bodyParser = require('body-parser')
const Feed = require('feed').Feed;
var feedster = require('feed-generator');
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

//rss feed
app.get("/test", function(req, res) {
  // var feedster = require('feed-generator');
  // var feed = feedster.createFeed({
  //     title: 'My Awesome Blog'
  // });
  // feed.addItem({
  //     title: 'My first blog post',
  //     // thats badly formatted date (no timezone etc.) but it works
  //     pubDate: '2011-01-01 14:34:00'
  // })
  // var rss = feed.render({indent: '  '});
  // return res.type('application/xml').send(rss);

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

      //const feed = new Feed();
      topNews.forEach(news => {
        feed.addItem({
            id: news.url,
            title: news.title,
            link: news.url,
            description: news.description,
            content: news.content,
            pubDate: news.publishedAt
        })
      });
           
      var rss = feed.render({indent: '  '});
      return res.type('application/xml').send(rss);
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

app.get("/feedTest", function(req, res){

  let topNews = `<rss version="2.0">
  <channel>
      <title>FeedForAll Sample Feed</title>
      <description>
      RSS is a fascinating technology. The uses for RSS are expanding daily. Take a closer look at how various industries are using the benefits of RSS in their businesses.
      </description>
      <link>http://www.feedforall.com/industry-solutions.htm</link>
      <category domain="www.dmoz.com">
      Computers/Software/Internet/Site Management/Content Management
      </category>
      <copyright>Copyright 2004 NotePage, Inc.</copyright>
      <docs>http://blogs.law.harvard.edu/tech/rss</docs>
      <language>en-us</language>
      <lastBuildDate>Tue, 19 Oct 2004 13:39:14 -0400</lastBuildDate>
      <managingEditor>marketing@feedforall.com</managingEditor>
      <pubDate>Tue, 19 Oct 2004 13:38:55 -0400</pubDate>
      <webMaster>webmaster@feedforall.com</webMaster>
      <generator>FeedForAll Beta1 (0.0.1.8)</generator>
      <image>
          <url>http://www.feedforall.com/ffalogo48x48.gif</url>
          <title>FeedForAll Sample Feed</title>
          <link>http://www.feedforall.com/industry-solutions.htm</link>
          <description>FeedForAll Sample Feed</description>
          <width>48</width>
          <height>48</height>
      </image>
      <item>
          <title>RSS Resources</title>
          <description>
            <p>
                Be sure to take a look at some of our favorite RSS Resources
                <a href="http://www.rss-specifications.com">
                    RSS Specifications
                </a>
                <a href="http://www.blog-connection.com">
                    Blog Connection
                </a>
            </p>
          </description>
          <link>http://www.feedforall.com</link>
          <pubDate>Tue, 26 Oct 2004 14:01:01 -0500</pubDate>
      </item>
          <item>
          <title>Recommended Desktop Feed Reader Software</title>
          <description>
          <p>
              Be sure to take a look at some of our favorite RSS Resources
              <a href="http://www.rss-specifications.com">
                  RSS Specifications
              </a>
              <a href="http://www.blog-connection.com">
                  Blog Connection
              </a>
          </p>
          </description>
          <link>http://www.feedforall.com/feedforall-partners.htm</link>
          <pubDate>Tue, 26 Oct 2004 14:03:25 -0500</pubDate>
      </item>
      <item>
          <title>Recommended Web Based Feed Reader Software</title>
          <description>
          <p>
              Be sure to take a look at some of our favorite RSS Resources
              <a href="http://www.rss-specifications.com">
                  RSS Specifications
              </a>
              <a href="http://www.blog-connection.com">
                  Blog Connection
              </a>
          </p>
          </description>
          <link>http://www.feedforall.com/feedforall-partners.htm</link>
          <pubDate>Tue, 26 Oct 2004 14:06:44 -0500</pubDate>
      </item>
  </channel>
  </rss>`;

  return res.type('application/xml').send(topNews);
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