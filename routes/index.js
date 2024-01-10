var express = require('express');
var router = express.Router();
var mysql=require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user, // Vaš MySQL korisnik
    password: process.env.password, // Vaš MySQL password
    database: process.env.database, // ime baze
    port:process.env.port
});



connection.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log(process.env.host)

    console.log('Connected to database as id ' + connection.threadId);
});

/* GET home page. */

router.get('/izvjestaji', (req,res)=>{
    res.render('izvjestaji');


})
router.get('/', function(req, res, next) {
res.render("index")

});

router.get('/vozaci', function(req, res, next) {

    const sql = "select * from vozac_projekat";
    var podaci = [];

    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {

            podaci.push(results);

            console.log(podaci);
            // Move res.render inside the callback
            res.render('vozaci', {podaciSvi:podaci[0]});

        }
    });
});


router.get('/obrisiVozaca/:id', (req, res) => {
    console.log(req.params);
    const sql = "delete from vozac_projekat where id_vozaca = ?";

    connection.query(sql, [req.params.id], (err, result) => {
        if(err) {
            console.log(err);
            return
        }
        res.redirect('/vozaci')
    })


})
router.post('/dodajVozaca' ,(req, res)=>{
    const sql = ' insert into vozac_projekat (ime, prezime, datum_isteka_licence, datum_isteka_dozvole, aktivan) values (?,?,?,?,?)'
    const {ime, prezime, datum1, datum2, aktivan}=req.body;
    connection.query(sql, [ime, prezime, datum1, datum2, aktivan], (err, result)=>{
        if (err){
            console.log(err);
        }
        else {
            res.redirect('/vozaci');
        }
    })
}
)

router.get('/vozila', function(req, res, next) {

    const sql = "select * from vozila_projekat where aktivan=1";
    var podaci = [];

    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {

            podaci.push(results);

            console.log(podaci);
            // Move res.render inside the callback
            res.render('vozila', {podaciSvi:podaci[0]});

        }
    });
});
router.post('/putniNalog', function(req, res, next) {

    const sql = "call dajKompletanPutniNalog(?) ";
    var podaci = [];

    connection.query(sql, [req.body.id], (err, results) => {
        if (err) {
            console.log(err);
        } else {

            podaci.push(results[0]);

            console.log(podaci[0]);
            // Move res.render inside the callback
            res.send(podaci[0]);

        }
    });
});
router.post('/JSONVozac', function(req, res, next) {

    const sql = "select * from vozac_projekat where id_vozaca=? ";
    var podaci = [];

    connection.query(sql, [req.body.id], (err, results) => {
        if (err) {
            console.log(err);
        } else {

            podaci.push(results[0]);

            console.log(podaci[0]);
            // Move res.render inside the callback
            res.send(podaci[0]);

        }
    });
});
router.post('/naloziPoLinijama', function(req, res, next) {

    const sql = "call proc1(?,?)";
    console.log(req.body);
    var podaci = [];

    connection.query(sql, [req.body.datum1,req.body.datum2], (err, results) => {
        if (err) {
            console.log(err);
        } else {

            podaci.push(results[0]);

            console.log(podaci[0]);
            // Move res.render inside the callback
            res.render('naloziPoLinijama', { title: 'Express', podaciSvi: podaci[0] });

        }
    });
});

router.post('/brojVozaca', function(req, res, next) {
    const sql = "call proc2(?,?)";
    var podaci = [];

    connection.query(sql,[req.body.datum1, req.body.datum2] , (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results[0]);
            podaci.push(results[0]);


            // Move res.render inside the callback
            res.render('brojVozaca', { title: 'Express', podaciSvi: podaci[0] });
        }
    });
});

router.post('/vozaciKojiNisuVozili', function(req, res, next) {
    const sql = "call proc3(?,?)";
    var podaci = [];

    connection.query(sql,[req.body.datum1, req.body.datum2], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results[0]);
            podaci.push(results[0]);


            // Move res.render inside the callback
            res.render('vozaciKojiNisuVozili', { title: 'Express', podaciSvi: podaci[0] });
        }
    });
});

router.post('/brojRazlicitihLinijaVozaca', function(req, res, next) {
    const sql = "call proc4(?,?)";
    var podaci = [];

    connection.query(sql,[req.body.datum1, req.body.datum2] ,(err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results[0]);
            podaci.push(results[0]);


            // Move res.render inside the callback
            res.render('brojRazlicitihLinijaVozaca', { title: 'Express', podaciSvi: podaci[0] });
        }
    });
});

router.post('/uporedniIzvjestaj', function(req, res, next) {
    const sql = "call proc5(?,?,?,?)";
    var podaci = [];

    connection.query(sql,[req.body.datum1, req.body.datum2, req.body.datum3, req.body.datum4], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results[0]);
            podaci.push(results[0]);


            // Move res.render inside the callback
            res.render('uporedniIzvjestaj', { title: 'Express', podaciSvi: podaci[0] });
        }
    });
});

router.post('/brojVoznjiPoVozilu', function(req, res, next) {
    const sql = "call proc6(?,?,?)";
    var podaci = [];

    connection.query(sql,[req.body.datum1, req.body.datum2, req.body.sort] ,(err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results[0]);
            podaci.push(results[0]);


            // Move res.render inside the callback
            res.render('brojVoznjiPoVozilu', { title: 'Express', podaciSvi: podaci[0] });
        }
    });
});

router.post('/NajduzeVoznjePoVozilu', function(req, res, next) {
    const sql = "call proc7(?,?,?)";
    var podaci = [];

    connection.query(sql,[req.body.datum1, req.body.datum2, req.body.sort] , (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results[0]);
            podaci.push(results[0]);


            // Move res.render inside the callback
            res.render('NajduzeVoznjePoVozilu', { title: 'Express', podaciSvi: podaci[0] });
        }
    }); //nesto/:
});

/*router.get('/nesto', (req,res)=> {
     res.render("nesto");


    }
)*/

module.exports = router;
