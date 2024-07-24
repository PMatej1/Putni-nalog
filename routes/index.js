var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user, // Vaš MySQL korisnik
    password: process.env.password, // Vaš MySQL password
    database: process.env.database, // ime baze
    port: process.env.port
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

/* GET home page. */
router.get('/', (req, res) => {
    res.render("index");
});

router.get('/izvjestaji', (req, res) => {
    res.render('izvjestaji');
});

router.get('/vozaci', (req, res) => {
    const sql = "SELECT * FROM vozac_projekat";
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render('vozaci', { podaciSvi: results });
        }
    });
});

router.delete('/obrisiVozaca/:id', (req, res) => {
    const sql = "DELETE FROM vozac_projekat WHERE id_vozaca = ?";
    connection.query(sql, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return;
        }
        res.redirect('/vozaci');
    });
});

router.post('/dodajVozaca', (req, res) => {
    const sql = 'INSERT INTO vozac_projekat (ime, prezime, datum_isteka_licence, datum_isteka_dozvole, aktivan) VALUES (?, ?, ?, ?, ?)';
    const { ime, prezime, datum1, datum2, aktivan } = req.body;
    connection.query(sql, [ime, prezime, datum1, datum2, aktivan], (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/vozaci');
        }
    });
});

router.get('/vozila', (req, res) => {
    const sql = "SELECT * FROM vozila_projekat WHERE aktivan = 1";
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render('vozila', { podaciSvi: results });
        }
    });
});

router.post('/putniNalog', (req, res) => {
    const sql = "CALL dajKompletanPutniNalog(?)";
    connection.query(sql, [req.body.id], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.send(results[0]);
        }
    });
});

router.post('/JSONVozac', (req, res) => {
    const sql = "SELECT * FROM vozac_projekat WHERE id_vozaca = ?";
    connection.query(sql, [req.body.id], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.send(results[0]);
        }
    });
});

router.post('/naloziPoLinijama', (req, res) => {
    const sql = "CALL proc1(?, ?)";
    connection.query(sql, [req.body.datum1, req.body.datum2], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render('naloziPoLinijama', { title: 'Express', podaciSvi: results[0] });
        }
    });
});

router.post('/brojVozaca', (req, res) => {
    const sql = "CALL proc2(?, ?)";
    connection.query(sql, [req.body.datum1, req.body.datum2], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render('brojVozaca', { title: 'Express', podaciSvi: results[0] });
        }
    });
});

router.post('/vozaciKojiNisuVozili', (req, res) => {
    const sql = "CALL proc3(?, ?)";
    connection.query(sql, [req.body.datum1, req.body.datum2], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render('vozaciKojiNisuVozili', { title: 'Express', podaciSvi: results[0] });
        }
    });
});

router.post('/brojRazlicitihLinijaVozaca', (req, res) => {
    const sql = "CALL proc4(?, ?)";
    connection.query(sql, [req.body.datum1, req.body.datum2], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render('brojRazlicitihLinijaVozaca', { title: 'Express', podaciSvi: results[0] });
        }
    });
});

router.post('/uporedniIzvjestaj', (req, res) => {
    const sql = "CALL proc5(?, ?, ?, ?)";
    connection.query(sql, [req.body.datum1, req.body.datum2, req.body.datum3, req.body.datum4], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render('uporedniIzvjestaj', { title: 'Express', podaciSvi: results[0] });
        }
    });
});

router.post('/brojVoznjiPoVozilu', (req, res) => {
    const sql = "CALL proc6(?, ?, ?)";
    connection.query(sql, [req.body.datum1, req.body.datum2, req.body.sort], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render('brojVoznjiPoVozilu', { title: 'Express', podaciSvi: results[0] });
        }
    });
});

router.post('/NajduzeVoznjePoVozilu', (req, res) => {
    const sql = "CALL proc7(?, ?, ?)";
    connection.query(sql, [req.body.datum1, req.body.datum2, req.body.sort], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render('NajduzeVoznjePoVozilu', { title: 'Express', podaciSvi: results[0] });
        }
    });
});

module.exports = router;
