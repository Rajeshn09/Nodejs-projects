

const express = require('express');
const app = express();
const path = require('path');
const db = require("./connection");
const session = require('express-session');


app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));




// Middleware
const isLoggedInMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};



// Home Route
app.get("/", (req, res) => {
  res.render("index");
});

// Login Routes
app.get("/login", (req, res) => {
  let error = req.session.error;
  
  res.render('login', { error: error });

 
}).post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      
      res.status(500).send('Error logging in');
      return;
    }
    
    if (results.length > 0) {
      const user = results[0];
      req.session.user = user;
      const endpoint = `/notes/${req.session.user.username}`
      
      res.redirect("/notes");
    } else {
      req.session.error = 'Invalid username or password'; 
      res.redirect('login');

    }
  });
});

// Signup Routes
app.get('/signup', (req, res) => {
  let error = req.session.error;
  
  res.render('signup', { error: error });
}).post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      req.session.error = 'Username already exists';
      res.render("signup",{error:req.session.error})
      return;
    }
    res.redirect("/login")
  });
});

// Notes Routes
app.get('/notes', isLoggedInMiddleware, (req, res) => {
  if (req.session.user) {
    db.query('SELECT * FROM task', (err, results) => {
      if (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Error fetching tasks');
        return;
      }
      
      res.render('home', { tasks: results });
    });
  } else {
    res.send("Please login <a href='/login'>login</a>");
  }
}).post('/notes', (req, res) => {
  const { title, description, date } = req.body;
  const name = "rajeshn";
  db.query('INSERT INTO task (title, description, date_to_complete,username) VALUES (?, ?, ?, ?)', [title, description, date, req.session.user.username], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).send('Error saving up');
      return;
    }
    res.redirect(`/notes`);
  });
}).post('/delete/:task_id', (req, res) => {
  const task_id = req.params.task_id;
  
  db.query(`DELETE FROM task WHERE task_id = ?`, [task_id], (err, result) => {
    if (err) {
      console.error(err);
      res.json({ success: false, error: 'Error deleting task' });
    } else {
      res.redirect("/notes")
    }
  });
}).post('/save/:task_id', (req, res) => {
  const task_id = req.params.task_id;
  const { title, description, date } = req.body;
  db.query(`UPDATE task SET title = ?, description = ?, date_to_complete = ? WHERE task_id = ?`, [title, description, date, task_id], (err, result) => {
    if (err) {
      console.error(err);
      res.json({ success: false, error: 'Error updating task' });
    } else {
      res.redirect('/notes');
    }
  });
});

// Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/');
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



