/*******************************************************************************
 *******************************************************************************
 **
 **  Harriet Mason's Site
 **  Developed by Angelo Cisneros 
 **  primary technologies: 
 **    node.js
 **    express.js
 **    postgres (pg)
 **    sequelize
 **    bcrypt
 **    passport && passport-local
 **    cookie-session
 **    foundation front-end framework
 **
 *******************************************************************************
*******************************************************************************/

var express        = require('express'),
    bodyParser     = require('body-parser'),
    db             = require('./models'),
    passport       = require('passport'),
    session        = require('cookie-session'),
    methodOverride = require('method-override'),
    request        = require("request"),
    tokens         = require('./config/tokens.json')
    app            = express();

////////////////////////////////////////////////////////////////////////////////
 /*               *
 ** APP SETTINGS  **
 *                */
////////////////////////////////////////////////////////////////////////////////
// set default view engine to EJS
app.set( 'view engine', 'ejs');

// set static directory for styles, site img, and js
app.use( express.static(__dirname + '/public'));

// use bodyParser to be able to grab params from body
app.use( bodyParser.urlencoded( { extended:true } ));

// use methodOverride to allow Patch and Destroy routes
app.use( methodOverride('_method'));


/******************************************************************************/
 //                 //
 // Passport Setup  //
 //                 //
/******************************************************************************/

// establish a session, initialize passport and use the session
app.use(session({
                 secret: 'thisismysecretkey',
                 name:   'chocolate chip',
                 maxage: 3600000
                })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser  ( function (user, done) {
  done(null, user.id);
});

passport.deserializeUser( function (id, done) {
  db.user
    .find({ 
      where : 
      {  id : id  }
    })
    .then( 
      function(user) {
          done(null, user);
      },
      function (err) {
           done(err, null);
      }
    );
});

////////////////////////////////////////////////////////////////////////////////
 /*               *
 ** Users Routes  **
 *                */
////////////////////////////////////////////////////////////////////////////////

// when a guest wants to sign up, show signup page
app.get('/signup', function (req, res) {
  if ( req.user ) {
    res.render ('users/signup', { title: 'signup', user : req.user });
  } else {
    res.render ('users/signup', { title: 'signup', user : false    });
  }
});

// guest signs up to be a newUser. Creates newUser || redirects to signup page
app.post('/users', function (req, res) {
  var newUser = req.body.user;
  console.log ("new user:", newUser);
    /*  fn from model for clarity     //
    //                                //
    //    createSecure ( email,       //
    //                   password,    //
    //                   error,       //
    //                   success      //
    //                 );             //
    //                                */
  db.user
    .createSecure(
    //email
    newUser.email,
    //password
    newUser.password, 
    //error
    function () {
      res.redirect("/signup");
    },
    //success
    function (err, user) {
      // if the user is successfully created, also create a placeholder row 
      //   in userDemog table
     db.userDemog
       .create ({userId: user.id})
       .then ( function(user){
            console.log("OOOOOOOOOO USER ID IS     " + user.id + "    OOOOOOOOOO");
          req.login (user, function(){
        
            res.redirect('/users/:id/new', {user: user, userId :user.id});
                           })
                    }
             );
    })
});

// after first login, show update demographics form
app.get('/users/:id/new', function (req, res) {
  db.user
    .find( req.params.id )
    .then( function (user) {
         res.render
         ('users/new', { user : user});
    })
    .error( function () {
          res.redirect
          ('/signup');
    })
});

// when existingUser wants login page
app.get('/login', function (req, res) {
  if ( req.user ) {
    res.render ('users/login', { title: 'login', user : req.user });
  } else {
    res.render ('users/login', { title: 'login', user : false    });
  }
});

// after existingUser signs in; routes to their profile. if(err) redirect-> signup
app.get('/users/:id', function (req, res) {
  db.user
    .find({
           where: { id : req.params.id },
           include: [db.userDemog]
    })
    .then( function (user) {
         console.log(user.values);
         res.render
         ('users/profile', { user : user});
    })
    .error( function () {
          res.redirect
          ('/signup');
    })
});

// authenticating a user, relies on existing User.methods in model:User
app.post('/login', 
            passport
              .authenticate (
                  'local', { 
                      successRedirect: '/',
                        failureRedirect: '/login'
                      }
              )
        );

// when loading site root, check if Guest or User, then pass {} into site root
app.get('/', function (req, res) {
  if ( req.user ) {
    res.render ( 'site/index', { title: 'homepage', user : req.user });
  } else {
    res.render ( 'site/index', { title: 'homepage', user : false    });
  }
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

////////////////////////////////////////////////////////////////////////////////
 /*                    *
 ** USER DEMOGRAPHICS  **
 *                     */
////////////////////////////////////////////////////////////////////////////////
app.post('/userdemog/:id', function (req, res) {
  var userId = req.params.id;
  db.userDemog
    .find ({
            where   : { userId: userId }
    })
    .then (function (foundDemographic) {
            foundDemographic
            .updateAttributes
            ({
              firstName         : req.body.userDemog.firstName,
              lastName          : req.body.userDemog.lastName,
              suffix            : req.body.userDemog.suffix
              
            })
            .success
            ( function (results) {
                console.log("demographics updated");
                res.redirect('/users/'+ results.userId);
              });
    })
    .catch( function (err) {
      console.log(err);
    });
});

////////////////////////////////////////////////////////////////////////////////
 /*                *
 ** EVENTBRITE    **
 *                */
////////////////////////////////////////////////////////////////////////////////

// when a guest visits event homepage (eventbrite api and weather underground API)
app.get('/event', function(req, res){
  var eventbriteURL      = "https://www.eventbriteapi.com/"
                            + "v3/events/14937457337/\?token\="
                            + tokens.eventbriteToken;
  var weatherUnderground = "http://api.wunderground.com/api/" 
                            + tokens.weatherUndergroundToken
                            + "/conditions/q/OR/Portland.json";

  if ( req.user ) {
    // first connect to Eventbrite to get current event details
    request(eventbriteURL, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        var event = JSON.parse(body);
      }
      // then connect to Weather Underground for current weather in portland
      request(weatherUnderground, function(error, response, body) {
        if(!error && response.statusCode == 200) {
          var weather = JSON.parse(body);
        }
        // pass both request objects into the render engine
        res.render('events/index', {
                                    title   : 'events', 
                                    user    : req.user, 
                                    event   : event,
                                    weather : weather
                                   })
      })
    });
  } else {
    res.render ( 'site/index', { title: 'homepage', 
                                 user : false    });
  }
});



////////////////////////////////////////////////////////////////////////////////
 /*                   *
 ** GUESTBOOK ROUTES  **
 *                    */
////////////////////////////////////////////////////////////////////////////////

// when a user wants to create a new guestbook entry, render the new post form
app.get('/guestbook/:user_id/new', function (req, res) {
  
  var userId = req.params.user_id;
  
  db.user
    .find({
           where : { id : userId },
           include: [db.userDemog]
    })
    .then(function (user) {
      res.render('guestbook/new', { user: user });
    })
    .catch(function (err) {
      console.log(err);
    });

});

// when a user submits the new post form 
app.post('/guestbook/:user_id/new', function (req, res) {
  var userId = req.params.user_id;
  db.post
    .create({
             title   : req.body.post.title,
             content : req.body.post.content,
             img_url : req.body.post.img_url,
             userId  : userId
    })
    .then( function (post) {
      res.redirect('/guestbook/posts/' + post.id);
    })
    .catch( function (err) {
      console.log(err);
    });
});

// when a user wants to see a particular post
app.get('/guestbook/posts/:id', function (req, res) {
  var id = req.params.id;
  db.post
    .find({
           where: { id : id},
           include : [db.user, db.userDemog]
    })
    .then(function (post) {
      console.log(post);
      res.render('guestbook/show', { post : post, user: req.user });
    })
    .catch(function (err) {
      console.log(err);
    });
});

// when a user wants to delete a particular guestbook entry
app.delete('/guestbook/:user_id/post/:id', function (req, res) {
  if ( req.user ) {
    db.post
      .find( {where: {id : req.params.id} })
      .then(function (foundPost) {
        if (req.user.id === foundPost.userId){
         foundPost.destroy()
                  .then( function () {
                     console.log('Post deleted');
                     res.render('guestbook/deleted', { user: req.user});
                  })
         } else {
          res.json('You cannot delete this post because you are not the author, please go back and create a new post.');
         }
        }
        )
        .catch(function (err) {
          console.log(err);
        });
  } else {
    res.render ('layouts/pleaseLogin', { title: 'about', user : false    });
  }

});

// when a user wants to see all guestbook posts
// if they are not authenticated, redirect to PleaseLogin page
app.get('/guestbook', function (req, res) {
  if ( req.user ) {
    db.post
      .findAll({ include: [db.user, db.userDemog] })
      .then(function (foundPosts) {
        res.render('guestbook/index', { postList : foundPosts, user : req.user, title: 'guestbook' });
      })
      .catch(function (err) {
        console.log(err);
      });
  } else {
    res.render ('layouts/pleaseLogin', { title: 'about', user : false    });
  }


  
});

////////////////////////////////////////////////////////////////////////////////
 /*               *
 ** STATIC ROUTES **
 *                */
////////////////////////////////////////////////////////////////////////////////

// when a guest visits about page
app.get('/about', function (req, res) {
  if ( req.user ) {
    res.render ('site/about', { title: 'about', user : req.user });
  } else {
    res.render ('layouts/pleaseLogin', { title: 'about', user : false    });
  }
});

// when a user visits the Out of Town Guests or Travel page
app.get('/travel', function (req, res) {
  if ( req.user ){
    res.render ('events/travel', { title: 'travel', user : req.user });
  } else {
    res.render ('layouts/pleaseLogin', { title: 'about', user : false    });
  }
});

// when a guest visits contact page
app.get('/contact', function (req, res) {
  if ( req.user ) {
    res.render ('site/contact', { title: 'contact', user : req.user });
  } else {
    res.render ('layouts/pleaseLogin', { title: 'about', user : false    });
  }
});

// // when a guest visits gift homepage
// // will have to be in second release
// app.get('/gifts', function (req, res) {
//   if ( req.user ){
//     res.render ('events/gifts', { title: 'gifts', user : req.user });
//   } else {
//     res.render ('layouts/pleaseLogin', { title: 'about', user : false    });
//   }
// });


////////////////////////////////////////////////////////////////////////////////
 /*                  *
 ** GALLERY ROUTES  **
 *                  */
////////////////////////////////////////////////////////////////////////////////

// require gallery.js from node-gallery module
var gallery = require('./controllers/gallery/gallery.js'),

// require file system utilities for grabbing items from a directory
util = require('util');

// setup a new static folder to store and serve images from
app.use(express.static(__dirname + '/resources'));

// config middleware to operate on 'resources/photos' && set route to '/gallery'
app.use(gallery.middleware({ 
                             static:    'resources', 
                             directory: '/photos', 
                             rootURL:   "/gallery"
                           })
        );

// configure a variable route that will accept album names
app.get('/gallery*', function(req, res){
  var data = req.gallery;
  data.layout = false; // Express 2.5.* support, don't look for layout.ejs
  
  if ( req.user ) {
    data["user"] = req.user;
    res.render ( data.type + '.ejs', data);
  } else {
    res.render ('layouts/pleaseLogin', { title: 'about', user : false    });
  }
});


/*******************************************************************************
 *******************************************************************************
 **               **
 ** START SERVER  **
 **               **
 *******************************************************************************
*******************************************************************************/
db.sequelize.sync().then( function () {
  var server = app.listen (process.env.PORT || 3000, function () {
    console.log ( new Array (50).join("*") );
    console.log ( "\t listening \n\t\t localhost: " + 3000 );
    console.log ( new Array (50).join("*") );
  });
});