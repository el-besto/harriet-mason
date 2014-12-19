# Harriet Mason's Site

## Description
<p>
  What: Birthday site for gma Harriet's 85th birthday celebration. 
</p>
<p>
  Why: Completed as a first project for General Assembly's WDI program.
</p>

## KEY LINKS
- [github repo](https://github.com/el-besto/harriet-mason)
- [heroku]()

## KEY LEARNINGS

0. Shifting gears is hard. Moving from the "Learn, Practice, Repeat Loop" had me in a particular mindset ad it took me a while to get back into the project management and product management mindset. However, you cannot forget the previous skills when tackling a completely new project.

1. Plan first, DO not allow yourself to start actually building until you have a list of features in front of you. Research is ok, building is not. In short - document first. 
REMEMBER: JUST BECAUSE YOU CAN DOESNT MEAN YOU SHOULD

2. Careful with Git merges. Do not use a feature of version control unless you KNOW what you're doing. Overall don't overreach your bounds, do what you know first, get fancy and improve later.

3. Sleep and frequently breaks are crucial. Bret suggested a particular time-tracking app he has started to use.


## KEY DELIVERABLES
    - "A plan for your pages"  - see scope
    - "A well-defined and written out feature list" 
    - "A written Minimum Viable Product (MVP)"
    - "A list project milestones"



# MVP
    Design a site for my gma's 85 birthday celebration where invitees can access important links to attend the event (EVENT) and a way for them to share their favorite memories with her (GUESTBOOK). Only registered users should be able to post to the Guestbook for two reasons:
    1. We need to keep the messages secure, as they may contain private information, and
    2. We do not want random people on the web 'trolling' the site

    It would be nice to be able to upload photos, and comment on them, but its not a requirement
    It would be nice to register for Eventbrite directly through a front-end form in the app, but its not a requirement.






# SCOPE
### Share Birthday Celebration Details, Provide Additional Resources for Invitees
> View event details on event homepage
> Link RSVP on Eventbrite (pull data from Eventbrite API)
> Link local restaurants (link to Yelp w/embeded search criteria, "Restaurants" in "Portland, OR")
> Link local hotels (link to Yelp w/embeded search criteria, "hotels" in "Portland, OR")
> Link travel sites (link to Kayak and Hipmunk)

### Share Photos of Gma's Life
> View Gallery (Pictures from Gma's life)
  1. As albums
  2. As single images
> <b>Post Gallery (Upload a new photo to local file system OR preferably remote host, e.g. Amazon S3)</b>* <small>nice to have</small>
  1. Add tags (year, location (as outlined in the "About Harriet" page, i.e. Balaton, Colorado, San Diego, Portland, Other))

### Make a Guest into a User
> Signup (create secure passowrd (bcrypt hashing), and store username in db (postgres))
> <b>Signup using OAuth (Facebook, Twitter, AOL)</b>* <small>nice to have</small>
> Sign in (authenticate as a user and store session (passport, passport-local, cookie-session))
> Post demographics (for primary email contact info and physical mailing address)
> Update demographics (for primary email contact info and physical mailing address)
> Logout, close session

### Share favorite memories of Gma using a Guestbook feature
> View Guestbook as authorized user
> Post Guestbook as authorized user
> View Guestbook posts
> View Guestbook posts single

### Share more about Gma
> Static page - About Harriet's life
> Static page - Contact form (email Harriet)

### Make site live and available on the interwebs
> Deploy and host on Heroku






# MILESTONES

### Github
> Initialize remote repository on [github](https://github.com/el-besto/harriet-mason)
> Setup gitignore to keep

### Wireframes
> Draw simple user flow, get yo' head straight!
> Draw static pages draft
> Draw Gallery pages (albums, single photo)
> Draw Event pages 
> Draw User profile page
> [Wireframes](https://trello.com/c/TZZoQMwp/30-wireframes)

### Database
> Draw simple ERD, include fields (pen-and-paper, Omnigraffle later)
> Create db (postgres-cli)
> Create models in db (Sequelize)
> - users
> - userDemogs
> - posts
> - <b>addresses</b>* <small>nice to have</small>
> Add associations to models in db (Sequelize)
> - *list associations here*
> Test Db (node-cli & PG Commander)

### Front-end Environment Setup
> Add Front-end framework (Zurb Foundation 5)
> Add IE8 Fix for ZF5 from [James Croker](http://foundation.zurb.com/forum/posts/241-foundation-5-and-ie8)
> Add Grunt-watch, live-reload
> Add Bower for front-end dependency management

### Forms
> Create front-end forms (html5, css)
> Add Db interaction to forms (node w/express, method-override, passport, etc.)
> Style front-end forms (ZF5)

### User Authentication
> Use Bcrypt && Passport to create encrypted password and authenticate user to site
> Use Passport-Local for establishing user session 

### Eventbrite
> Add event to Eventbrite
> Sign up for API Key
> Pull event details to app using API
> Keep tokens safe by including a custom module and adding it to .gitignore
> <b>Register to event through front-end form in app</b>* <small>nice to have</small>

### Gallery
> Find npm module - [node-gallery](https://www.npmjs.com/package/node-gallery) by Cian Clarke
> Integrate into current app
> Upload images 


### Static Pages
> add responsive slider to homepage, used [slick.js](http://kenwheeler.github.io/slick/) as ZF5's documentation deprecated Orbital slider and suggested using slick.


### Guestbook
> Add Authurization to page route to prevent non-authenticated users from viewing or posting
> Destroy post (method-override's _METHOD)


### Refactor
- Views Templating: breakup HTML into partials ('view engine': 'ejs' )
- Layouts Templating: breakup into partials (header, footer, forms)
- Routes Modularization: *still to do* 
- Add Easter egg to login form (great video of illustrious 'pun intended' Bob Ross helpinng explaining why those clouds are such [Happy Little Clouds](https://www.youtube.com/watch?v=YLO7tCdBVrA)
- Comment up all the code!!!


### Deploy
Heroku
> project on [heroku]()
- prep for deployment (create proc file)
  1. modify package.json
  2. add proc file
  3. add dynamo for Db (postgres)







## Key Technologies Used
>core language: javascript

>backend: 
```javascript
  node.js 
  //node back-end modules
  express.js, sequelize, bcrypt, passport && passport-local, cookie-session
  //templating and view engine
  ejs
```
>database: 
```
  postgres (pg)
```

> front-end: 
```
  [EJS]()
  [Foundation 5 framework]() (CSS, Modernizer, )
  - modernizr
  - jquery
  [IE8 Fix]()
  [Slick.js]()
  [FlipClock.js]()
  [Skrollr.js]()
```