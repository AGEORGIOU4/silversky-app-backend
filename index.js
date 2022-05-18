const sqlite3 = require('sqlite3').verbose();
const { sqlite } = require('sqlite');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

var timetable_data = {
    books: [
        {id: 1,authors: 'test',title: '',ISBN: '',year: '', loanable: '', quantity: 2}
    ],
    students: [
        {id: 1, name: 'test', YOB: 1999}
    ],
    modules: [
        {code: "CodeTest", name: 'test'}
    ],
    loans: [
        {bookID: 1,studentID: 1,due: ''}
    ],
    bibliography: [
        {id: 1, moduleCode: "dsa", bookID: 1}
    ]

}


let db = new sqlite3.Database("./db/assignment.db",(err)=>{
    if(err){
        return console.error(err.message);
    }
    console.log('Connected to the file-based SQlite database.');
});
db.serialize(()=>{
    db.run('CREATE TABLE IF NOT EXISTS playerLoc(playerid INTEGER PRIMARY KEY, x REAL NOT NULL, y REAL NOT NULL, z REAL NOT NULL)');
    db.run('CREATE TABLE IF NOT EXISTS planeColor(planeid INTEGER PRIMARY KEY, color TEXT NOT NULL)');
    db.run("INSERT INTO playerLoc(playerid,x,y,z) VALUES (?,?,?,?)", ["1","0","0","0"],function (err){
        if(err){
            console.log("Already exists");
        }else{
            console.log("PlayerCords Added!");
        }
    });
    db.run("INSERT INTO planeColor(planeid,color) VALUES (?,?)", ["1","white"],function (err){
        if(err){
            console.log("Already exists");
        }else{
            console.log("Plane 1 Added!");
        }
    });
    db.run("INSERT INTO planeColor(planeid,color) VALUES (?,?)", ["2","white"],function (err){
        if(err){
            console.log("Already exists");
        }else{
            console.log("Plane 2 Added!");
        }
    });
    db.run("INSERT INTO planeColor(planeid,color) VALUES (?,?)", ["3","white"],function (err){
        if(err){
            console.log("Already exists");
        }else{
            console.log("Plane 3 Added!");
        }
    });
});
//Get playercords
app.get('/silversky/playercords/get/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    db.get('SELECT * FROM playerLoc WHERE playerid=?',[id],(err,row)=> {
        if(!row){
            res.status(404)
                .setHeader('content-type','application/json')
                .send({error: "Player was not found!"});
        } else{
            res.status(200)
                .setHeader('content-type','application/json')
                .send({id: `${row.playerid}`,x: `${row.x}`,y: `${row.y}`,z: `${row.z}`});
        }
    });
    
});

//Edit playercords
app.put('/silversky/playercords/update/:id', (req, res) => {
    const { id } = req.params; // get id from params
    const posted_cords = req.body; // submitted module
    console.log(posted_cords.x, posted_cords.y,posted_cords.z)
    db.run(`UPDATE playerLoc SET x=?, y=?,z=? WHERE playerid=?`,
            [posted_cords.x, posted_cords.y,posted_cords.z,id], (err) => {
        if(err) {
            if(err.code === 'SQLITE_CONSTRAINT') {
                res.status(422)
                    .setHeader('content-type', 'application/json')
                    .send({ error: "Something went wrong: "+err.message});
            } else { // other server-side error
                res.status(500)
                    .setHeader('content-type', 'application/json')
                    .send({ error: "Server error: " + err});
            }
        } else {
            res.status(200)
                .setHeader('content-type', 'application/json')
                .send({ message: "Playercords updated"});
        }
    });              
});

//Get plane color
app.get('/silversky/plane/get/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    db.get('SELECT * FROM planeColor WHERE planeid=?',[id],(err,row)=> {
        if(!row){
            res.status(404)
                .setHeader('content-type','application/json')
                .send({error: "Plane was not found!"});
        } else{
            res.status(200)
                .setHeader('content-type','application/json')
                .send({id: `${row.planeid}`,color: `${row.color}`});
        }
    });
    
});
//Edit plane color
app.put('/silversky/plane/update/:id', (req, res) => {
    const { id } = req.params; // get id from params
    const posted_cords = req.body; // submitted module
    
    db.run(`UPDATE planeColor SET color=? WHERE planeid=?`,
            [posted_cords.color,id], (err) => {
        if(err) {
            if(err.code === 'SQLITE_CONSTRAINT') {
                res.status(422)
                    .setHeader('content-type', 'application/json')
                    .send({ error: "Something went wrong: "+err.message});
            } else { // other server-side error
                res.status(500)
                    .setHeader('content-type', 'application/json')
                    .send({ error: "Server error: " + err});
            }
        } else {
            res.status(200)
                .setHeader('content-type', 'application/json')
                .send({ message: "Plane color updated"});
        }
    });              
});





/////////////////////////////////////////////////

//Get All students
app.get('/assignment/students', (req, res) => {
    var students = [];
    db.all('SELECT id,name,YOB FROM student',(err,rows)=>{
        if(err){
            console.error('Problem while querying database: '+err);
            res.status(500)
                .setHeader('content-type','application/json')
                .send({error: "Problem while querying database"});
        }   
        rows.forEach(row=>
            students.push({id: `${row.id}`,name: `${row.name}`,YOB:`${row.YOB}`}));
        res.status(200)
            .setHeader('content-type','application/json')
            .send(students);
    });
});

//Get book by id
app.get('/assignment/book/:id', (req, res) => {
    const { id } = req.params;
    if(Object.keys(req.params.id).length!=0){
        db.get('SELECT id, authors, title, ISBN,year,loanable,quantity FROM book WHERE id=?',id,(err,row)=> {
            if(err || !Number.isInteger(parseInt(id))){
                
                res.status(422)
                    .setHeader('content-type','application/json')
                    .send({error: "Problem while querying database or id is not numeric"});
                return;
            }
            if(!row){
                res.status(404)
                    .setHeader('content-type','application/json')
                    .send({error: "Book was not found!"});
            } else{
                res.status(200)
                    .setHeader('content-type','application/json')
                    .send({id: `${row.id}`,authors: `${row.authors}`,title: `${row.title}`,ISBN: `${row.ISBN}`});
            }
        });
    }else{
        res.status(423)
            .setHeader('content-type','application/json')
            .send({error: "You forgot to add a parameter!"});
    }
    
});

//Get book by title
app.get('/assignment/book', (req, res) => {
    const title = req.query.title;
    var books=[];
    
    db.all('SELECT * FROM book WHERE title like ?',`%`+title+`%`,(err,rows)=> {
        if(err){
            console.error('Problem while querying database: '+err);
            res.status(422)
                .setHeader('content-type','application/json')
                .send({error: "Problem while querying database"});
        }
        if(!rows){
            res.status(404) //Practically useless to have here but why not.
                .setHeader('content-type','application/json')
                .send({error: "Book title was not found!"});
        } else{
            rows.forEach(row=>
                books.push({id: `${row.id}`,authors: `${row.authors}`,title:`${row.title}`,ISBN: `${row.ISBN}`,year: `${row.year}`,loanable: `${row.loanable}`, quantity: `${row.quantity}`}));
            res.status(200)
                .setHeader('content-type','application/json')
                .send(books);
        }
    });
    
});
//Add book
var bookPos=0;
app.post('/assignment/book', (req, res) => {
    const posted_book = req.body; 

    timetable_data.books.push(posted_book); // add to local model
    bookPos++;
    var id = timetable_data.books[bookPos].id;
    var authors = timetable_data.books[bookPos].authors;
    var title = timetable_data.books[bookPos].title;
    var ISBN = timetable_data.books[bookPos].ISBN
    var year = timetable_data.books[bookPos].year;
    var loanable = timetable_data.books[bookPos].loanable;
    var quantity = timetable_data.books[bookPos].quantity;
    console.log(title+'  '+year);

    db.get("SELECT * FROM book WHERE id=?",[id], (err,row)=>{
        if(err){
            res.status(422)
                .setHeader('content-type', 'application/json')
                .send({ message: "Something went wrong."});
        }
        if(row){
            if(!res.headersSent){
                res.status(409)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "This id already exists in the database."});
            }
        }
    })

    
    db.run("INSERT INTO book (id,authors,title,ISBN,year,loanable,quantity) VALUES (?,?,?,?,?,?,?)", [id,authors,title,ISBN,year,loanable,quantity],function (err){
        if(err){
            if(!res.headersSent){
                res.status(422)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "Failed to add: Constraints were not met."});
            }
        }else{
            if(!res.headersSent){
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "Book added"});
            }
        }
    });
        
        
        
    
   
});

//Make this recalculate if id is the same with another one.
//Add Student
var studentPos=0;
app.post('/assignment/student', (req, res) => {
    var id = parseInt(Math.random()*10000+1);
    const posted_student = req.body; 
    
    
    timetable_data.students.push(posted_student); // add to local model
    studentPos++;
    db.get("SELECT * FROM student WHERE id=?",[id], (err,row)=>{
        if(err){
            res.status(422)
                .setHeader('content-type', 'application/json')
                .send({ message: "Something went wrong: "+ err.message});
        }
        if(row){
            while(row.id === id){
                id = parseInt(Math.random()*10000+1);
            }
        }
    })
    var name = timetable_data.students[studentPos].name;
    var YOB = timetable_data.students[studentPos].YOB;
    console.log(id+'<id '+name +'<name YOB>'+YOB);
    
    db.run("INSERT INTO student (id,name,YOB) VALUES (?,?,?)", [id,name,YOB],function (err){
        if(err){
            if(!res.headersSent){
                res.status(422)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "Failed to add: Constraints were not met."});
            }
        }else{
            if(!res.headersSent){
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "student added"});
            }
        }
    });
        
        
        
    
   
});

//Get Student by ID
app.get('/assignment/student/:id', (req, res) => {
    const { id } = req.params;
    if(Object.keys(req.params.id).length!=0){
        db.get('SELECT id,name,YOB FROM student WHERE id=?',id,(err,row)=> {
            if(!Number.isInteger(parseInt(id))){
                if(!res.headersSent){
                    res.status(422)
                        .setHeader('content-type','application/json')
                        .send({error: "Problem while querying database or id is not numeric"});
                }
            }
            if(!row){
                if(!res.headersSent){
                    res.status(404)
                        .setHeader('content-type','application/json')
                        .send({error: "student was not found!"});
                }
            } else{
                if(!res.headersSent){
                    res.status(200)
                        .setHeader('content-type','application/json')
                        .send({id: `${row.id}`,name: `${row.name}`,YOB: `${row.YOB}`});
                }
            }
            
        });
    }else{
        res.status(423)
            .setHeader('content-type','application/json')
            .send({error: "You forgot to add a parameter!"});
    }
    
});

//Get Student by name
app.get('/assignment/student', (req, res) => {
    const name = req.query.name;
    var students=[];
    
    db.all('SELECT * FROM student WHERE name like ?',`%`+name+`%`,(err,rows)=> {
        if(err){
            console.error('Problem while querying database: '+err);
            res.status(422)
                .setHeader('content-type','application/json')
                .send({error: "Problem while querying database"});
        }
        if(!rows){
            res.status(404)
                .setHeader('content-type','application/json')
                .send({error: "Student name was not found!"});
        } else{
            rows.forEach(row=>
                students.push({id: `${row.id}`,name: `${row.name}`,YOB:`${row.YOB}`}));
            res.status(200)
                .setHeader('content-type','application/json')
                .send(students);
        }
    });
    
});

//Edit student
app.put('/assignment/student/:id', (req, res) => {
    const { id } = req.params; // get id from params
    const posted_student = req.body; // submitted module
    if(!posted_student || !posted_student.name || !posted_student.YOB) {
        res.status(400) // bad request
            .setHeader('content-type', 'application/json')
            .send({ error: `Values are missing from request`});
    } else {
        db.get(`SELECT * FROM student WHERE id=?`, [id], (err, row) => {
            if(err) {
                res.status(500)
                    .setHeader('content-type', 'application/json')
                    .send({ error: "Server error: " + err});
            } else {
                if(!row) { // true if 'module' not set
                    res.status(404)
                        .setHeader('content-type', 'application/json')
                        .send({ error: "Student not found for id: " + id}); // resource not found
                } else { // module found, let's update it
                    db.run(`UPDATE student SET name=?, YOB=? WHERE id=?`,
                            [posted_student.name, posted_student.YOB,id], (err) => {
                        if(err) {
                            if(err.code === 'SQLITE_CONSTRAINT') {
                                res.status(422)
                                    .setHeader('content-type', 'application/json')
                                    .send({ error: "Something went wrong: "+err.message});
                            } else { // other server-side error
                                res.status(500)
                                    .setHeader('content-type', 'application/json')
                                    .send({ error: "Server error: " + err});
                            }
                        } else {
                            res.status(200)
                                .setHeader('content-type', 'application/json')
                                .send({ message: "Student updated with id: " + id});
                        }
                    });
                }
            }
        });
    }
});

//Edit book
app.put('/assignment/book/:id', (req, res) => {
    const { id } = req.params; // get id from params
    const posted_book = req.body; 
    if(!posted_book || !posted_book.ISBN || !posted_book.title) {
        res.status(400) // bad request
            .setHeader('content-type', 'application/json')
            .send({ error: `Book must have an ISBN`});
    } else {
        db.get(`SELECT * FROM book WHERE id=?`, [id], (err, row) => {
            if(err) {
                res.status(500)
                    .setHeader('content-type', 'application/json')
                    .send({ error: "Server error: " + err});
            } else {
                if(!row) { // true if 'book' not set
                    res.status(404)
                        .setHeader('content-type', 'application/json')
                        .send({ error: "Book not found for id: " + id}); // resource not found
                } else { // book found, let's update it
                    db.run(`UPDATE book SET id=?, authors=?, title=?, ISBN=?, year=?, loanable=?, quantity=abs(?)+quantity WHERE id=?`,
                            [posted_book.id, posted_book.authors, posted_book.title,posted_book.ISBN,posted_book.year,posted_book.loanable,posted_book.quantity,id], (err) => {
                        if(err) {
                            if(err.code === 'SQLITE_CONSTRAINT') {
                                res.status(409) // resource already exists
                                    .setHeader('content-type', 'application/json')
                                    .send({ error: `Book already exists: ${posted_book.code}`});
                            } else { // other server-side error
                                res.status(422)
                                    .setHeader('content-type', 'application/json')
                                    .send({ error: "Something went wrong: " + err});
                            }
                        } else {
                            res.status(200)
                                .setHeader('content-type', 'application/json')
                                .send({ message: "Book updated: " + posted_book.id});
                        }
                    });
                }
            }
        });
    }
});

//Add module
var modulePos=0;
app.post('/assignment/module', (req, res) => {
    
    const posted_module = req.body; 
    
    // look up for existing module with  given code 
    db.get("SELECT * FROM module WHERE code=?",[posted_module.code], (err,row)=>{
        if(err){
            res.status(422)
                .setHeader('content-type', 'application/json')
                .send({ message: "Something went wrong."});
        }
        if(row){
            if(!res.headersSent){
                res.status(409)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "This module code already exists in the database."});
            }
        }
    })
    timetable_data.modules.push(posted_module); // add to local model
    modulePos++;
    
    var code = timetable_data.modules[modulePos].code;
    var name = timetable_data.modules[modulePos].name;
    
    
    db.run("INSERT INTO module (code,name) VALUES (?,?)", [code,name],function (err){
        if(err){
            if(!res.headersSent){
            res.status(422)
                .setHeader('content-type', 'application/json')
                .send({ message: "Failed to add: Constraints were not met."});
            }
        }else{
            if(!res.headersSent){
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "module added"});
            }
        }
    });
});

//Get All modules
app.get('/assignment/modules', (req, res) => {
    var modules = [];
    db.all('SELECT code,name FROM module',(err,rows)=>{
        if(err){
            console.error('Problem while querying database: '+err);
            res.status(500)
                .setHeader('content-type','application/json')
                .send({error: "Problem while querying database"});
        }   
        rows.forEach(row=>
            modules.push({code: `${row.code}`,name: `${row.name}`}));
        res.status(200)
            .setHeader('content-type','application/json')
            .send(modules);
    });
});

//Get Module by id
app.get('/assignment/module/:id', (req, res) => {
    const { id } = req.params;
    
    if(Number.isInteger(parseInt(id))){
        db.get('SELECT * FROM module WHERE id=?',id,(err,row)=> {
            if(err){
                console.error('Problem while querying database: '+err);
                res.status(422)
                    .setHeader('content-type','application/json')
                    .send({error: "Problem while querying database"});
            }
            if(!row){
                res.status(404)
                    .setHeader('content-type','application/json')
                    .send({error: "Module was not found!"});
            } else{
                res.status(200)
                    .setHeader('content-type','application/json')
                    .send({id: `${row.id}`,code: `${row.code}`,name: `${row.name}`});
            }
        });
    }else{
        res.status(422)
            .setHeader('content-type','application/json')
            .send({error: "ID must be a number!"});
    }
    
});

//Get Module By code and name
app.get('/assignment/module', (req, res) => {
    const code = req.query.code;
    const name = req.query.name;

    if(code){
    db.get('SELECT code,name FROM module WHERE code=?',code,(err,row)=> {
        if(err){
            console.error('Problem while querying database: '+err);
            res.status(422)
                .setHeader('content-type','application/json')
                .send({error: "Problem while querying database"});
        }
        if(!row){
            res.status(404)
                .setHeader('content-type','application/json')
                .send({error: "Module was not found!"});
        } else{
            res.status(200)
                .setHeader('content-type','application/json')
                .send({code: `${row.code}`,name: `${row.name}`});
        }
    });
    }
    if(name){
        var modules=[];
        
        db.all('SELECT * FROM module WHERE name like ?',`%`+name+`%`,(err,rows)=> {
            if(err){
                console.error('Problem while querying database: '+err);
                res.status(422)
                    .setHeader('content-type','application/json')
                    .send({error: "Problem while querying database"});
            }
            if(!rows){
                res.status(404)
                    .setHeader('content-type','application/json')
                    .send({error: "Module name was not found!"});
            } else{
                rows.forEach(row=>
                    modules.push({code: `${row.code}`,name: `${row.name}`}));
                res.status(200)
                    .setHeader('content-type','application/json')
                    .send(modules);
            }
        });
    }
    
});

//Get Module by name
app.get('/assignment/module', (req, res) => {
   
    
    
});

//Edit module
app.put('/assignment/module/:code', (req, res) => {
    const { code } = req.params; // get code from params
    const posted_module = req.body; // submitted module
    if(!posted_module || !posted_module.code || !posted_module.name) {
        res.status(400) // bad request
            .setHeader('content-type', 'application/json')
            .send({ error: `Values are missing from request`});
    } else {
        db.get(`SELECT * FROM module WHERE code=?`, [code], (err, row) => {
            if(err) {
                res.status(500)
                    .setHeader('content-type', 'application/json')
                    .send({ error: "Server error: " + err});
            } else {
                if(!row) { // true if 'module' not set
                    res.status(404)
                        .setHeader('content-type', 'application/json')
                        .send({ error: "Module not found for code: " + code}); // resource not found
                } else { // module found, let's update it
                    db.run(`UPDATE module SET code=?, name=? WHERE code=?`,
                            [posted_module.code, posted_module.name,code], (err) => {
                        if(err) {
                            if(err.code === 'SQLITE_CONSTRAINT') {
                                res.status(409) // resource already exists
                                    .setHeader('content-type', 'application/json')
                                    .send({ error: `Module already exists: ${posted_module.code}`});
                            } else { // other server-scodee error
                                res.status(422)
                                    .setHeader('content-type', 'application/json')
                                    .send({ error: " " + err.message});
                            }
                        } else {
                            res.status(200)
                                .setHeader('content-type', 'application/json')
                                .send({ message: "Module updated: " + posted_module.code});
                        }
                    });
                }
            }
        });
    }
});

const checkLoanable = function(bookID){
    return new Promise((resolve, reject)=>{
        console.log(bookID);
        db.get('SELECT * FROM book WHERE id='+bookID,(err,row)=>{
            if (err) {
                console.log("error")
                reject();
                }
            if(row){
                
                if(row.loanable==0){
                    console.log("not loanable")
                    reject();
                        
                }
                console.log("success")
                resolve(row);
            }else{
                console.log("undefined")
                reject();
                    
            }
            console.log("End of promise")
        });
    
    })
}

//Add loan
var loanPos=0;
app.post('/assignment/loan', (req, res) => {
    
    const posted_loan = req.body; 
    
    // look up for existing loan with given bookid 
    
    timetable_data.loans.push(posted_loan); // add to local model
    loanPos++;
    
    var bookID = timetable_data.loans[loanPos].bookID;
    var studentID = timetable_data.loans[loanPos].studentID;
    var getDue = timetable_data.loans[loanPos].due;
    var due = new Date(getDue);
    var date = new Date();
    
    

    var numDaysBetween = function(d1, d2) {
            var diff = Math.abs(d1.getTime() - d2.getTime());
            return Math.round(diff / (1000 * 60 * 60 * 24));
    };
    
    //console.log(theRow);
    
    /*checkLoanable(bookID)
        .then((val)=>{console.log("success" + val.loanable)})
        .catch(()=>{
            res.status(422)
                .setHeader('content-type', 'application/json')
                .send({ message: "Failed to add loan: book is not loanable!"});
            return;
        });
        console.log("after promise");
        return;*/

    if(date == "Invalid Date" || due == "Invalid Date"){
        if (!res.headersSent) {
            res.status(422)
                .setHeader('content-type', 'application/json')
                .send({ message: "One or more dates are invalid!" });
        }
    }
    if(date>due){
        if (!res.headersSent) {
            res.status(422)
                .setHeader('content-type', 'application/json')
                .send({ message: "Due date must be after checkout" });
        }
    }    
    
    db.get('SELECT loanable FROM book WHERE id=?', [bookID], (err, row) => {
        
        if (err) {
            return console.error(err.message);
        }
        if (row) {

            if (row.loanable != 1) {
                if (!res.headersSent) {
                    res.status(422)
                        .setHeader('content-type', 'application/json')
                        .send({ message: "Failed to add loan: book is not loanable!" });
                }
            }
        } else {
            if (!res.headersSent) {
                res.status(422)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "Failed to add loan: book or student doesnt exist!" });
            }
        }
        
        return row;
    });

    
    
       
    
    
    db.get('SELECT id FROM student WHERE id=?',[studentID],(err,row)=>{
        if (err) {
            return console.error(err.message);
            }
        if(row){
            console.log("exists");
        }else{
            if(!res.headersSent){
                res.status(422)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "Failed to add loan: book or student doesnt exist!"});
				
            }
        }
        return row;
    });

    

    db.get('SELECT * FROM loan WHERE studentID=? AND bookID=?',[studentID,bookID],(err,row)=>{
        if (err) {
            return console.error(err.message);
            }
        if(row){
            if(!res.headersSent){
                res.status(409)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "Failed to add loan: You already loaned this book!"});
            }
        }
        return row;
    });
    

    if(numDaysBetween(date,due)>90){
        if(!res.headersSent){
            res.status(422)
                .setHeader('content-type', 'application/json')
                .send({ message: "Failed to add loan: Due date must be 90 days within checkout!"});
        }
    }
    
    
    
    
        
    
    db.run("INSERT INTO loan (bookID,studentID,checkout,due) VALUES (?,?,?,?)", [bookID,studentID,new Date(date).toDateString(),new Date(due).toDateString()],function (err){
        if(err){
            if(!res.headersSent){
                res.status(422)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "Failed to add: Constraints were not met."});
            }
        }else{
            if(!res.headersSent){
            res.status(200)
            .setHeader('content-type', 'application/json')
            .send({ message: "loan added"});
            }
        }
    });
      
        
      
       
});

//Get loans by bookid and studentid
app.get('/assignment/loan', (req, res) => {
    const bookID = req.query.bookID;
    const studentID = req.query.studentID;
    var loans=[];
    
    if(bookID){
        db.all('SELECT * FROM loan WHERE bookID=?',bookID,(err,rows)=> {
            if(err || !Number.isInteger(parseInt(bookID))){
                
                res.status(422)
                    .setHeader('content-type','application/json')
                    .send({error: "Problem while querying database or bookid not numeric"});
                return;
            }
            if(rows.length===0){
                res.status(404)
                    .setHeader('content-type','application/json')
                    .send({error: "loan bookid was not found!"});
            } else{
                rows.forEach(row=>
                    loans.push({id: `${row.id}`,bookID: `${row.bookID}`})); //It doesnt specify if we should show everything so I did just the first two.
                res.status(200)
                    .setHeader('content-type','application/json')
                    .send(loans);
                loans = [];
            }
        });
        
    }
    if(studentID){
        db.all('SELECT * FROM loan WHERE studentID=?',studentID,(err,rows)=> {
            if(err || !Number.isInteger(parseInt(studentID))){
                
                res.status(422)
                    .setHeader('content-type','application/json')
                    .send({error: "Problem while querying database or studentid not numeric"});
                    return;
            }
            if(rows.length ===0){
                res.status(404)
                    .setHeader('content-type','application/json')
                    .send({error: "loan studentid was not found!"});
            } else{
                rows.forEach(row=>
                    loans.push({id: `${row.id}`,studentID: `${row.studentID}`}));
                res.status(200)
                    .setHeader('content-type','application/json')
                    .send(loans);
                    loans = [];
            }
        });
    }
    
});



//Edit a loan 
app.put('/assignment/loan/:id', (req, res) => {
    const { id } = req.params; // get id from params
    const posted_loan = req.body; // submitted loan
    if(!posted_loan || !posted_loan.id) {
        res.status(400) // bad request
            .setHeader('content-type', 'application/json')
            .send({ error: `Values are missing from request`});
    } else {
        if (new Date(posted_loan.checkout).toDateString() !== "Invalid Date" && new Date(posted_loan.due).toDateString() !== "Invalid Date") {
		var numDaysBetween = function(d1, d2) {
			  var diff = Math.abs(d1.getTime() - d2.getTime());
			  return Math.round(diff / (1000 * 60 * 60 * 24));
		};
		if(numDaysBetween(new Date(posted_loan.checkout),new Date(posted_loan.due))>90){
            if (!res.headersSent) {
            res.status(422)
                .setHeader('content-type', 'application/json')
                .send({ message: "Failed to update loan: Due date must be 90 days within checkout!"});
            }
        }
        if(posted_loan.checkout>posted_loan.due){
            if (!res.headersSent) {
                res.status(422)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "Due date must be after checkout" });
            }
        }    
        db.get(`SELECT * FROM loan WHERE id=?`, [id], (err, row) => {
            if(err) {
                if (!res.headersSent) {
                    res.status(500)
                        .setHeader('content-type', 'application/json')
                        .send({ error: "Server error: " + err});
                }
            } else {
                if(!row) { // true if 'loan' not set
                    if (!res.headersSent) {
                        res.status(404)
                            .setHeader('content-type', 'application/json')
                            .send({ error: "loan not found for id: " + id}); // resource not found
                    }
                } else { // loan found, let's update it
                    db.run(`UPDATE loan SET id=?, checkout=?,due=?,returned=? WHERE id=?`,
                            [posted_loan.id, posted_loan.checkout ? new Date(posted_loan.checkout).toDateString() : null, posted_loan.due ? new Date(posted_loan.due).toDateString() : null, posted_loan.returned ? posted_loan.returned : null,id], (err) => {
                        if(err) {
                            if(err.id === 'SQLITE_CONSTRAINT') {
                                if (!res.headersSent) {
                                    res.status(409) // resource already exists
                                        .setHeader('content-type', 'application/json')
                                        .send({ error: `loan already exists: ${posted_loan.id}`});
                                }
                            } else { // other server-side error
                                if (!res.headersSent) {
                                    res.status(422)
                                        .setHeader('content-type', 'application/json')
                                        .send({ error: "Error: " + err.message});
                                }
                            }
                        } else {
                            if (!res.headersSent) {
                                res.status(200)
                                    .setHeader('content-type', 'application/json')
                                    .send({ message: "loan updated: " + posted_loan.id});
                            }
                        }
                    });
                }
            }
        });
    }else{
        res.status(422)
                .setHeader('content-type', 'application/json')
                .send({ message: "Failed to update loan: Due and checkout dates must be valid!"});
                return;
    }
    }
    
});
//Needs work still! make constraints when u figure it out.
//Put a bibliography
var bilbPos=0;
app.post('/assignment/bibliography', (req, res) => {
    const posted_bibliography = req.body; // submitted module - picked from body
    var dontAdd = false;
    //Check if moduleid and bookid exist in their tables
    db.get('SELECT * FROM module WHERE code=?',[posted_bibliography.moduleCode], (err,row)=>{
        if(err){
            if(!res.headersSent){
                res.status(422)
                    .setHeader('content-type', 'application/json')
                    .send({ error: "Something went wrong: "+err.message});
            }
            dontAdd = true;
        }
        if(!row){
            if(!res.headersSent){
                res.status(404)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "ModuleCode does not exist!"});
            }
            dontAdd = true;
        }
    })
    db.get('SELECT * FROM book WHERE id=?',[posted_bibliography.bookID], (err,row)=>{
        if(err){
            if(!res.headersSent){
                res.status(422)
                    .setHeader('content-type', 'application/json')
                    .send({ error: "Something went wrong: "+err.message});
            }
            dontAdd = true;
        }
        if(!row){
            if(!res.headersSent){
                res.status(404)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "BookID does not exist!"});
            }
            dontAdd = true;
        }
    })

    // look up for existing module with  given code 
    db.get('SELECT * FROM bibliography WHERE moduleCode=? AND bookID=?',[posted_bibliography.moduleCode,posted_bibliography.bookID], (err,row)=>{
        
    if(err){
        if(!res.headersSent){
            res.status(422)
                .setHeader('content-type', 'application/json')
                .send({ message: "Something went wrong!"});
        }
        dontAdd = true;
    }
    if(typeof(posted_bibliography.moduleCode)=='undefined' || typeof(posted_bibliography.bookID)=='undefined'){
        if(!res.headersSent){
        res.status(409)
            .setHeader('content-type', 'application/json')
            .send({ message: "ModuleCode or BookId is undefined!"});
        }
        dontAdd = true;
    }
    console.log(posted_bibliography.moduleCode);
    if(Number.isInteger(parseInt(posted_bibliography.moduleCode)) || !Number.isInteger(parseInt(posted_bibliography.bookID))){
        if(!res.headersSent){
            res.status(422)
                .setHeader('content-type', 'application/json')
                .send({ message: "ModuleCode must be text and bookID a number!"});
        }
        dontAdd = true;
    }
    
    
            
    if(row) { 
        if(!res.headersSent)
            res.status(409).send({message: "Bibliography already exists!"}); // resource already exists
        dontAdd = true;
    } else {
        timetable_data.bibliography.push(posted_bibliography); // add to local model
        bilbPos++;
        var id = timetable_data.bibliography[bilbPos].id;
        var moduleCode = timetable_data.bibliography[bilbPos].moduleCode;
        var bookID = timetable_data.bibliography[bilbPos].bookID;
        console.log(dontAdd);
        if(!dontAdd){
            db.run("INSERT INTO bibliography (id,moduleCode,bookID) VALUES (?,?,?)", [id,moduleCode,bookID],function (err){
                if(err){
                    if(!res.headersSent){
                        res.status(422)
                            .setHeader('content-type', 'application/json')
                            .send({ message: "Failed to add: Constraints were not met."});
                    }
                }else{
                    if(!res.headersSent){
                        res.status(200)
                            .setHeader('content-type', 'application/json')
                            .send({ message: "bibliography added"});
                    }
                }
            });
        }
    }
});
   
});

//Get Bibliography by moduleCode
app.get('/assignment/bibliography', (req, res) => {
    const moduleCode = req.query.moduleCode;
    
    var bibliographys=[];
    
    
	db.all('SELECT * FROM bibliography WHERE moduleCode=?',moduleCode,(err,rows)=> {
		if(err){
			
			res.status(422)
				.setHeader('content-type','application/json')
				.send({error: "Problem while querying database or moduleCode not numeric"});
			return;
		}
		if(rows.length===0){
			res.status(404)
				.setHeader('content-type','application/json')
				.send({error: "bibliography moduleCode was not found!"});
		} else{
			rows.forEach(row=>
				bibliographys.push({id: `${row.id}`,moduleCode: `${row.moduleCode}`,bookID: `${row.bookID}`}));
			res.status(200)
				.setHeader('content-type','application/json')
				.send(bibliographys);
			bibliographys = [];
		}
	});
        
    
});

//Delete bibliography
app.delete('/assignment/bibliography', (req, res) => {
    const bilBody = req.body; 
    db.run('DELETE FROM bibliography WHERE moduleCode=? AND bookID=?',[bilBody.moduleCode,bilBody.bookID], function(err) {
        if(err) {
            if(!res.headersSent){
                res.status(500)
                    .setHeader('content-type', 'application/json')
                    .send({ error: "Server error: " + err});
            }
        }
        if(!bilBody.moduleCode || !bilBody.bookID){
            if(!res.headersSent){
                res.status(422)
                    .setHeader('content-type', 'application/json')
                    .send({ error: "Missing values from requests"});
            }
        }
        if(this.changes === 0) {
            if(!res.headersSent){
                res.status(404)
                    .setHeader('content-type', 'application/json')
                    .send({ error: "Bibliography not found"});
            }
        } else {
            if(!res.headersSent){
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "Bibliography deleted"});
            }
        }
    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    console.log(`Press Ctrl+C to exit...`)
});
/*
db.close((err)=>{
    if(err){
        return console.error(err.message);
    }
    console.log("Disconnected and closed SQlite database");
});*/

