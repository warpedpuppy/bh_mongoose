const express = require('express'),
  bodyParser = require('body-parser'),       
  uuid = require('uuid');

  morgan = require('morgan'),
  app = express(),      
  mongoose = require('mongoose');
  Models = require('./models.js');


  Movies = Models.Movie;
  Users = Models.User;
//   Genres = Models.Genre;
//   Directors = Models.Director;

  mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  });

    

     
    app.use('/documentation.html', express.static('public'));

    app.use(morgan('common'));
    
    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({ extended: true }));
    

//---------Movie Requests--------



    app.get('/movies', (req, res) => {
        Movies.find()
          .then((movies) => {
              res.status(201).json(movies);
          })
          .catch((err) => {
              console.error(err);
              res.status(500).send("Error: " + err);
          });
    });

    app.get('/movies/:Title', (req, res) => {
        Movies.findOne({ Title: req.params.Title })
          .then((movie) => {
             res.json(movie);
          })
          .catch((err) => {
              console.error(err);
              res.status(500).send("Error: " + err);
          });
    });


    app.get('/directors', (req, res) => {
        Movies.find()
        .then( movies => {
            let directors = movies.map(movie => movie.Director);
            res.status(201).json(directors)

        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
  });
    

    app.get('/genres', (req, res) => {
        Movies.find()
        .then( movies => {
            let directors = movies.map(movie => movie.Genre);
            res.status(201).json(directors)

        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
  });
    

    app.get('/movies/genre/:name', (req, res) => {
    
        Movies.find({"Genre.Name": req.params.name})
        .then( movies => {
            res.status(201).json(movies)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });

    });
  

    // app.post('/movies', (req, res) => {
    //     let newMovie = req.body;

    //     if(!newMovie.title) {
    //         const message = 'Missing title in request body';
    //         res.status(400).send(message);
    //     }else {
    //         newMovie.id = uuid.v4();
    //         movies.push(newMovie);
    //         res.status(201).send(newMovie);
    //     }
    // });

    // app.delete('/movies/remove/:title', (req, res) => {
    //     res.send('Successful delete request returning list with movies removed that were deleted');
    // });

    //--------User requests--------

    app.get('/users', (req, res) => {
        Users.find()
        .then(function (users) {
            res.status(201).json(users);
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).send("Error:" + err);
        });
    });

    app.post('/users', (req, res) => {
        Users.findOne({Username: req.body.Username })
        .then((user) => {
             if (user) {
                 return res.status(400).send(req.body.Username + " already exists")
             } else {
                Users.create({
                     Username: req.body.Username,
                     Password: req.body.Password,
                     Email: req.body.Email,
                     Birthday: req.body.Birthday,
                })
                .then((user) => {
                    res.status(201).json(user);
                })
                .catch((error) => {
                    res.status(500).send("Error: " + error);
                });
             }
         })
    });

    app.put('/users/:id', (req, res) => {

        Users.findOne({_id: req.params.id })
        .then((user) => {
             if (!user) {
                 return res.status(400).send(req.body.Username + " does not exist")
             } else {

                let updateObject = {};
        
                if (req.body.Username) {
                    updateObject.Username = req.body.Username;
                }
                if (req.body.Password) {
                    updateObject.Password = req.body.Password; //THIS IS NOT FOR PRODUCTION -- YOU WOULD HAVE TO HASH THIS FOR PRODUCTION
                }
                if (req.body.Email) {
                    updateObject.Email = req.body.Email;
                }
                if (req.body.Birthday) {
                    updateObject.Birthday = req.body.Birthday;
                }

                Users
                .findByIdAndUpdate({_id: req.params.id}, updateObject, {new: true})
                .then((user) => {
                    res.status(201).json(user);
                })
                .catch((error) => {
                    res.status(500).send("Error: " + error);
                });
             }
         })
    });


    app.delete('/users/delete/:id', (req, res) => {
      
            Users.findOne({_id: req.params.id })
            .then((user) => {
                 if (!user) {
                     return res.status(400).send(req.body.Username + " does not exist")
                 } else {

                    Users
                    .findOneAndDelete({_id: req.params.id})
                    .then((user) => {
                        res.status(201).json(user);
                    })
                    .catch((error) => {
                        res.status(500).send("Error: " + error);
                    });
                 }
             })
    });



    app.get('/', (req, res) => {
        res.send('Welcome to My Flix');
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    
    app.listen(8080, () => {
        console.log('Your app is listening on port 8080.');
    });

    
    