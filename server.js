const express = require('express');
const server = express();
const db = require('./db')

server.use(express.static("public"));
server.use(express.urlencoded({extended: true}));

const nunjucks = require('nunjucks');
nunjucks.configure("views", {
    express: server,
    noCache: true,
})

server.get("/", function(req, resp){
    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return resp.send("ERRO NO BANCO DE DADOS!")
        }
        const reversIdeas = [...rows].reverse();
        let lastIdeas = []
        for (idea of reversIdeas) {
            if (lastIdeas.length < 2) {
                lastIdeas.push(idea);
            }
        }
        return resp.render("index.html", { ideas: lastIdeas });
    })
})

server.get("/ideias", function(req, resp){    
    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return resp.send("ERRO NO BANCO DE DADOS!")
        }
        const reversIdeas = [...rows].reverse();
        return resp.render("ideias.html", { ideas: reversIdeas});
    })
})

server.post("/", function(req, resp) {
    // Inserir
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES (?, ?, ?, ?, ?);`;

    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]

    db.run(query, values, function (err) {
        if (err) {
            console.log(err)
            return resp.send("ERRO NO BANCO DE DADOS!")
        }
        return resp.redirect('/ideias')
    });
})

server.listen(3000)