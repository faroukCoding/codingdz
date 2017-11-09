var config   = require('./app/config');
var download = require('./app/download');

//MONGO
var mongoose        = require('mongoose');
var Face            = require('./app/models').Face;
var FaceHelper      = require('./app/FaceHelper');
var Scrap           = require('./app/models').Scrap;
var Stat            = require('./app/models').Stat;

// call the packages we need
var express        = require('express');        // call express
var app            = express();
var exphbs         = require('express-handlebars');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var cors           = require('cors');
var session        = require('cookie-session')
var path           = require('path');
var methodOverride = require('method-override');
var flash          = require('connect-flash');
var Twitter        = require('twitter');
var fbgraph        = require('fbgraph');
var _              = require('underscore');
var mime           = require('mime');
var auth           = require('basic-auth');
var nodalytics     = require('nodalytics');
var passport       = require('passport');

//get file
var imgDestPath  = path.resolve('./public/img');
var imgDestPath  = path.resolve('./public/img');
var publicPath   = path.resolve('./public');
var gm           = require('gm');
var os           = require('os');

var routes = require('./app/routes');  //all define routes
var s3bucket = require('./app/providers/aws');  //aws provider

var admins = {
  'human': { password: 'human@123' },
};


//mongoDb connection
mongoose.connect(config.mongodb,{useMongoClient: true});

//express configuration
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public')); //set public folder to static >> but now host in amazon s3
app.use(flash());
app.use(nodalytics('UA-67692075-1'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/***** HANDLEBARS HELPERS ******/

app.engine('handlebars',
  exphbs({
    defaultLayout: 'main',
    helpers: {
        'checked': function(search, list){
          if(list){
            var listTab = JSON.parse(list);
            return _.contains(listTab, search, 0) ? 'checked="true"':'';
          }else{
            return '';
          }

        },
        'json': function(context) {
          return JSON.stringify(context);
        },
        ifCond: function(v1,operator,v2,options) {
              switch (operator){
                  case "==":
                      return (v1==v2)?options.fn(this):options.inverse(this);

                  case "!=":
                      return (v1!=v2)?options.fn(this):options.inverse(this);

                  case "===":
                      return (v1===v2)?options.fn(this):options.inverse(this);

                  case "!==":
                      return (v1!==v2)?options.fn(this):options.inverse(this);

                  case "&&":
                      return (v1&&v2)?options.fn(this):options.inverse(this);

                  case "||":
                      return (v1||v2)?options.fn(this):options.inverse(this);

                  case "<":
                      return (v1<v2)?options.fn(this):options.inverse(this);

                  case "<=":
                      return (v1<=v2)?options.fn(this):options.inverse(this);

                  case ">":
                      return (v1>v2)?options.fn(this):options.inverse(this);

                  case ">=":
                      return (v1>=v2)?options.fn(this):options.inverse(this);
              }
          }
    }

}));

app.set('view engine', 'handlebars');


// ROUTES FOR OUR API
// =============================================================================
var publicRouter = express.Router();

// root route (accessed at GET http://localhost:3000)
publicRouter.get('/', function(req, res) {
    res.render('home', {data:{'config': config, 'currentUser': req.user}});
});

/****** SCRAPING **********/

var CronJob = require('cron').CronJob;
/*new CronJob('*15 * * * * *', function() {

  console.log('You will see this message every 30 second');

  request.get({url:'https://vast-wave-2744.herokuapp.com/scraping/blank'}, function (err, response, body) {
    console.log('BODY', 'LOL');

    Scrap.count({}, function( err7, count){

        console.log( "Number of SCRAP:", count );

        if(count > 100000){

        var Client = require('ftp');

          var c = new Client();

          var mds = require('mongo-dump-stream');

          var dumpFileName = publicPath + '/' + Date.now() + '-scrap.db';
          var out = fs.createWriteStream(dumpFileName);

          c.on('ready', function() {
            c.put(dumpFileName, 'omh-scraping/' + Date.now() + '-scrap.db', function(err3) {
              if (err3){
                console.log('ERREUR', err4);
              }
              c.end();

              fs.unlink(dumpFileName, function(err5){
                console.log('DUMP FILE NAME DELETE', err5);
              });

            });
          });

          return mds.dump(config.mongodb, out, function(err6) {
            if (!err6) {

              console.log('ERREUR DUMP', err6);

              Scrap.remove({}, function(err4, face) {
                  if (err4){
                    res.send(err4);
                  }
              });
              c.connect({
                host: '188.121.47.126', // required
                user: 'lenoirjeremie', // required
                password: 'Marijuana@12', // required
                port: 21 // optional
                // port is added to the end of the host, ex: sftp://domain.com:22 in this case
              });

            }
          });
        }

    });


  });

}, null, true, 'France/Paris');*/


publicRouter.get('/put_to_scrap/:number', function(req, res, next) {
  Face.findOne({'number': req.params.number},function(err, face) {
      face.claim = false;
      face.save(function(err){
        console.log('ERREUR', err);
      });

  });

  Face.find(function(err, faces) {
      if (err){
        res.send(err);
      }
      res.render('register', {'faces': faces, 'nbFaces': (faces.length + 1)});

  });

});


publicRouter.get('/moderate/:offset', function(req, res, next) {

  var currentOffset = req.params.offset ? parseInt(req.params.offset, 10) : 0;

  Face.find().skip(req.params.offset).limit(1000).exec(function(err, faces) {
      if (err){
        res.send(err);
      }
      res.render('register', {'next': currentOffset + 1000,'config':config, 'previous': currentOffset - 1000, 'faces': faces, 'nbFaces': (faces.length + 1)});
  });

});



publicRouter.get('/populate/', function(req, res, next) {

  var client = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
  });

    Scrap.find({scraped: {$exists: false }}).limit(100000).exec(function(err, scrapes) {
      var scrapList = [];
      var scrapObject = [];
      var j = 0, boucle = 1;

      for(var i = 0; i < scrapes.length; i++){
        //if(scrapes[i].scraped == true)continue;

        if(j > 99){

          function closureScrapToFace() {
            var currentList = _.uniq(scrapList);
            var scrapObjectTemp = _.uniq(scrapObject);
            var number = i + 3;

            function insertScrapToFace() {
              client.get('users/lookup', {user_id: currentList.join(',')}, function(error, users, response){
                  if(users){
                    for(var k = 0; k < users.length; k++){
                      createUserFromTwitter(users[k], number);
                      number += 3;
                    }
                  }

                  for(var s = 0; s < scrapObjectTemp.length; s++){
                    scrapObjectTemp[s].scraped = true;
                    scrapObjectTemp[s].save(function(erreur){
                      if(erreur){
                        console.log('ERREUR SAVE SCRAPED', this);
                      }
                    });
                  }

              });
            }
            return insertScrapToFace;
          }

          setTimeout(closureScrapToFace(), (boucle * 15000));
          scrapList.splice(0,scrapList.length);
          scrapObject.splice(0,scrapObject.length);

          j = 0;
          boucle++;
        }

        scrapList.push(scrapes[i].twitter_id);
        scrapObject.push(scrapes[i]);

        j++;
      }

    });
    res.json('works');
});


publicRouter.get('/delete_scrap_in/', function(req, res, next) {

  var deleteScrapInFace = function (scrape){
    Face.findOne({'network_id': scrape.twitter_id},function(err, face) {
        if(face){
          scrape.remove(function(err){
            if(err){
              console.log('ERREUR DELETE SCRAP',scrape);
            }
          });
        }
    });
  };

  Scrap.find().limit(100000).exec(function(err, scrapes) {
      for(var i = 0; i < scrapes.length; i++){
        deleteScrapInFace(scrapes[i]);
      }
  });
  res.json('exec');
});

publicRouter.get('/scraping/:query', function(req, res, next) {
  var client = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
  });


  client.get('search/tweets', {q: /*req.params.query + */'rt since:2015-06-08', /*lang:'en',*/ count:100}, function(error, tweets, response){

     for(var i= 0; i < tweets.statuses.length; i++){


       function closureAddScrap(){
         var currentTweet = tweets.statuses[i];

         function addScrap(){
           Scrap.find({twitter_id: currentTweet.user.id}, function(err, scrapes) {

               if(scrapes.length > 0){
                 userExist = true;
                 scrapes[0].occurs = scrapes[0].occurs + 1;
                 scrapes[0].save(function(err) {
                     if (err){
                       console.log('SCRAPE UPDATED', err);
                     }
                 });
               }else{

               var scrap = new Scrap();
               /*Name: {{this.user.name}}
               Lang: {{this.lang}}
               Location: {{this.user.location}}
               Followers_count:{{this.user.followers_count}}
               Created_at: {{this.created_at}}
               Time_zone: {{this.user.time_zone}}
               Verified: {{this.user.verified}}
               Status_count: {{this.user.statuses_count}}
               Last update: {{this.user.status.created_at}}*/
               scrap.twitter_id= currentTweet.user.id;
               scrap.location= currentTweet.user.location;
               scrap.followers_count= currentTweet.user.followers_count;
               scrap.created_at= currentTweet.created_at;
               scrap.lang= currentTweet.lang;
               scrap.time_zone= currentTweet.user.time_zone;
               scrap.verified= currentTweet.user.verified;
               scrap.statuses_count= currentTweet.user.statuses_count;

               scrap.save(function(err) {
                   if (err){
                     console.log('ERROR SAVE NUMBER', err);
                   }


               });
             }

           });
         }

         return addScrap;
       }

       var closure = closureAddScrap();
       closure();

     }

     res.render('scraping', {'tweets': tweets});
  });

});

publicRouter.get('/register', function(req, res, next) {
  Face.find(function(err, faces) {
      if (err){
        console.log('ERROR', err);
        res.send(err);
      }
      res.render('register', {'faces': faces, 'nbFaces': (faces.length + 1), currentUser: req.user });
  });
});


publicRouter.get('/claim/:id', function(req, res, next) {

    Face.findOne({'accountname': req.user.accountname},function(err, face) {
        if (err){
          console.log('UTILISATEUR NON TROUVE', err);
        }else{

        if(req.user.accountname != req.params.id){
            res.render('home', {data:{'config': config, 'error': 'Account name does not match. Sorry'}});
        }else{
            face.claim = true;
            face.save(function(err) {
                if (err){
                  console.log('ERROR SAVE NUMBER', err);
                }
                res.render('home', {data:{'config': config, 'editedFace': face, 'currentUser': req.user, 'claim': true}});

            });
          }
        }
    });

});

publicRouter.get('/decline/:id', function(req, res, next) {

    Face.findOne({'accountname': req.user.accountname},function(err, face) {
        if (err){
          console.log('UTILISATEUR NON TROUVE', err);
        }else{

        if(req.user.accountname != req.params.id){
            res.render('home', {data:{'config': config, 'error': 'Account name does not match. Sorry'}});
        }else{
            Face.remove({
                accountname: req.params.id
            }, function(err, face) {
                if (err){
                  res.send(err);
                }else{
                  res.render('home', {data:{'config': config, 'decline': true, 'declineFace':req.params.id}});
                }
            });

          }
        }

    });

});


publicRouter.get('/success/:id', function(req, res, next) {

  Face.findOne({'_id': req.user._id},function(err, face) {
      if (err){
        console.log('UTILISATEUR NON TROUVE', err);
      }else{
          if(!face.number){
            face.number = req.params.id == 0 ? 1 : req.params.id;
            req.user.number = req.params.id == 0 ? 1 : req.params.id;
            face.number_id = parseInt(face.number, 10) - 1;
          }

          FaceHelper.getPreviousFace(face.number, function(previousFace){

            FaceHelper.getNextFace(face.number, function(nextFace){
              face.previous = previousFace.number;
              face.next = nextFace.number;

              Face.findOneAndUpdate({_id: previousFace._id}, { $set: { next: face.number }},{}, function(err){
                //console.log('ERREUR', err);

              });
              Face.findOneAndUpdate({_id: nextFace._id}, { $set: { previous: face.number }}, {}, function(err){
                //console.log('ERREUR', err);
              });

              face.save(function(err) {
                  if (err){
                    console.log('ERROR SAVE NUMBER', err);
                  }
                  res.redirect('/#success/');

              });
            });

          });


      }

  });

});

/***** EDIT PART *******/
publicRouter.get('/edit/:number', function(req, res, next) {

  Face.findOne({'number': req.params.number}, function(err, face) {
      if (err){
        res.send(err);
      }
      if(face.number == req.user.number){
        res.render('home', {data:{'config': config, 'editedFace': face, 'currentUser': req.user}});
      }else{
        res.send(err);
      }

  });
});


var getImagesForMozaic = function(number, callback){

        Face.findOne({'number': number}, function(err, face) {
            if (err){
              res.send(err);
            }

            download('http://files.onemillionhumans.com' + face.picture, publicPath + face.picture, function(errDownload,filename){
              if(!errDownload){
                  callback(null, face);
              }
            });

        });

};

var createFindImage = function(number, face, callback){
  var im = gm;

  gm()
  .command("composite")
  .in("-gravity", "Center")
  .in(publicPath + face.picture)
  .in(imgDestPath + '/human_share.jpg')
  .write(imgDestPath + '/' + number + '-temp.png' , function (err2) {
    var imgFinalMozaic = im(imgDestPath + '/' + number + '-temp.png');
    console.log('FACE IMAGE', face);

    //imgFinalMozaic.crop(450, 236, 0, 107);
    imgFinalMozaic.stream(function(err, stdout, stderr) {

      console.log('STREAM');

      var buf = new Buffer('');

      if(stdout){

        stdout.on('data', function(data) {
           buf = Buffer.concat([buf, data]);
        });

        stdout.on('end', function(data) {
          console.log('END STREAM');
          var data = {
            Bucket: config.S3_BUCKET_NAME,
            ACL: 'public-read',
            Key: 'img/mozaic/' + number + '-mozaic.png',
            Body: buf,
            ContentType: mime.lookup(imgDestPath + '/' + number + '-temp.png')
          };

          s3bucket.putObject(data, function(errr, ress) {

              if(errr){
                console.log(errr);
                callback(errr, null);
              }
              else{
                callback(null, imgDestPath + '/' + number + '-temp.png');
              }
            });
          });
        }
    });

  });

};

publicRouter.get('/number/:number', function(req, res, next) {
  console.log("get /number");
  /***** IMAGE manipulation *****/
  var number = parseInt(req.params.number, 10);
  getImagesForMozaic(number, function(err, image){

    console.log('IMAGE NUMBER', image);

    createFindImage(number, image, function(err1){

      Face.findOne({'number': req.params.number}, function(err, face) {
          if (err){
            res.send(err);
          }
          //res.send('test');
          res.render('home', {data:{'config': config, 'showFace': face, 'currentUser': req.user}});
      });
    });

  });

});



publicRouter.get('/error', function(req, res, next) {
  var errors = req.flash();
  res.render('home', {data:{'config': config, 'error' : errors.error[0]}});
});

publicRouter.get('/share/:number', function(req, res, next) {
  res.render('share', {data:{'config': config, 'number' : req.params.number}});
});

app.use(function(req, res, next) {
    config.root_url = req.protocol + "://" + req.get('host');
    config.assets_url = req.protocol + "://files." + req.get('host');
    return next();
});
//basic auth
if(config.need_auth){
  app.use(function(req, res, next) {

    var user = auth(req);
    if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
      res.set('WWW-Authenticate', 'Basic realm="example"');
      return res.status(401).send();
    }
    return next();
  });
}






app.use(routes);
app.use('/', publicRouter);



// START THE SERVER
// =============================================================================
var port = config.PORT || 3000;        // set our port
app.listen(port);
process.env['PATH'] = '/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/bin';
console.log('SERVER LAUNCHED ON PORT ' + port );
