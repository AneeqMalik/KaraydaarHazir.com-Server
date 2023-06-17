const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
let image = '';

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'karaydaarhazir.com',
});
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../client/src/', 'assests'),
    filename: function (req, file, cb) {
        // null as first argument means no error
        cb(null, file.originalname)
    }
})

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



//DML OPERATIONS
app.get('/api/get/detail', (req, res) => {
    const sqlSelect = "SELECT * FROM propertydetail";
    db.query(sqlSelect, (err, result) => {
        console.log(result);
        res.send(result);
    });
});

app.get('/api/feature', (req, res) => {
    const add = req.query.add;
    const sqlSelect = `SELECT * FROM propertyfeature WHERE PropertyAddress = '${add}'`;
    db.query(sqlSelect, (err, result) => {
        console.log(result);
        res.send(result);
    });
});
app.get('/api/payment', (req, res) => {
    const add = req.query.add;
    const sqlSelect = `SELECT * FROM propertypricing WHERE PropertyAddress = '${add}'`;
    db.query(sqlSelect, (err, result) => {
        console.log(result);
        res.send(result);
    });
});

app.get('/api/pricing', (req, res) => {
    const sqlSelect = "SELECT * FROM propertypricing";
    db.query(sqlSelect, (err, result) => {
        console.log(result);
        res.send(result);
    });
});
app.get('/api/recent', (req, res) => {
    const sqlSelect = "SELECT * FROM propertypricing";
    db.query(sqlSelect, (err, result) => {
        console.log(result);
        res.send(result);
    });
});

app.get('/api/id', (req,res) => {
    const number = req.query.contact;
    let query = `SELECT OwnerID FROM owner WHERE OwnerContact='${number}'`;
    db.query(query, (err, rows) => {
        if (err) throw err;
        // let results = JSON.parse(JSON.stringify(rows))
        console.log(rows);
        res.send(rows);
    });
})
app.get('/api/add', (req,res) => {
    const add = req.query.add;
    let query = `SELECT PropertyID FROM propertydetail WHERE PropertyAddress='${add}'`;
    db.query(query, (err, rows) => {
        if (err) throw err;
        // let results = JSON.parse(JSON.stringify(rows))
        console.log(rows);
        res.send(rows);
    });
})


app.get('/api/get/pricing', (req, res) => {
    const type = req.query.type;
    let query = `SELECT COUNT(PropertyType) AS COUNT FROM propertypricing WHERE PropertyType='${type}'`;
    db.query(query, (err, rows) => {
        if (err) throw err;
        let results = JSON.parse(JSON.stringify(rows))
        console.log(results);
        res.send(results);
    });
});
app.get('/api/get/pricedata', (req, res) => {
    const price = req.query.max;
    const type = req.query.type;
    let query = `SELECT * FROM propertypricing WHERE PropertyPrice<='${price}' && PropertyType='${type}'`;
    db.query(query, (err, rows) => {
        if (err) throw err;
        console.log(rows);
        res.send(rows);
    });
});

app.get('/api/get/owner', (req, res) => {
    const sqlSelect = "SELECT * FROM owner";
    db.query(sqlSelect, (err, result) => {
        console.log(result);
        res.send(result);
    });
});
app.get('/api/get/tenant', (req, res) => {
    const sqlSelect = "SELECT * FROM tenant";
    db.query(sqlSelect, (err, result) => {
        console.log(result);
        res.send(result);
    });
});

//Delete Query
app.post('/api/unlist', (req, res) => {
    const Name = req.body.Name;
    const Address = req.body.Address;
    const SqlQuery = `DELETE FROM propertydetail WHERE PropertyName='${Name}' AND PropertyAddress='${Address}'`;
    db.query(SqlQuery, (err, result) => {
        if (err) throw err;
        console.log("DELETED");
        res.send("DELETED");
    })
})

app.post('/api/send', (req, res) => {
    let upload = multer({ storage: storage }).single('avatar');
    upload(req, res, function (err) {

        // req.file contains information of uploaded file
        // req.body contains information of text fields
        image = req.file.filename;

    });
})
app.post('/api/detail', (req, res) => {

    const name = req.body.name;
    const add = req.body.add;
    const type = req.body.type;
    const descrip = req.body.descrip;
    const category = req.body.category;
    const space = req.body.space;


    const insertData1 = "INSERT INTO propertydetail(PropertyName,PropertyAddress,PropertyType,PropertyCategory,PropertySpace,PropertyDescription) VALUES (?,?,?,?,?,?)"
    db.query(insertData1, [name, add, type, category, space, descrip], (err, result) => {
        if (err) throw err
        console.log("Details Table OK")
    })

})
app.post('/api/features', (req, res) => {
    const add = req.body.add;
    const space = req.body.space;
    const bedrooms = req.body.bedrooms;
    const bathrooms = req.body.bathrooms;
    const park = req.body.park;
    const cc = req.body.cc;
    const cv = req.body.cv;
    const mail = req.body.mail;
    const state = req.body.state;
    const pet = req.body.pet;
    const province = req.body.province;
    const land = req.body.land;
    const year = req.body.year;
    const fur = req.body.fur;


    const insertData = "INSERT INTO propertyfeature(PropertyAddress,Size,Bedrooms,Bathrooms,Parking,PetFriendly,Furnished,CityView,Cooling,MailBox,State,Province,Landmark,ImageName,Year) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(insertData, [add, space, bedrooms, bathrooms, park, pet, fur, cv, cc, mail, state, province, land, image, year], (err, result) => {
        if (err) throw err
        console.log("Features Table OK")
    })
})
app.post('/api/price', (req, res) => {
    const add = req.body.add;
    const type = req.body.type;
    const price = req.body.price;
    const insertData = "INSERT INTO propertypricing(PropertyAddress,PropertyType,PropertyPrice, ImageName) VALUES(?,?,?,?)";
    db.query(insertData, [add, type, price, image], (err, result) => {
        if (err) throw err;
        console.log("Price Table OK")
    })
})
app.post('/api/login/owner', (req, res) => {
    const OwnerName = req.body.Name;
    const OwnerEmail = req.body.Email;
    const OwnerPassword = req.body.Password;
    const OwnerContact = req.body.Contact;
    const OwnerType = req.body.OwnerType;
    const OwnerInsert = "INSERT INTO owner(OwnerName, OwnerEmail, OwnerPassword, OwnerContact, OwnerType) VALUES (?,?,?,?,?)";
    db.query(OwnerInsert, [OwnerName, OwnerEmail, OwnerPassword, OwnerContact, OwnerType], (err, result) => {
        if (err) throw err;
        console.log(result);
    })
})
app.post('/api/ck', (req, res) => {
    const OwnerID = req.body.id;
    const PropertyID = req.body.pid;
    const Insert = "INSERT INTO candidatekey(OwnerID, PropertyID) VALUES (?,?)";
    db.query(Insert, [OwnerID, PropertyID], (err, result) => {
        if (err) throw err;
        console.log("Candidate Key OK");
    })
})
app.post('/api/login/tenant', (req, res) => {
    const TenantName = req.body.Name;
    const TenantEmail = req.body.Email;
    const TenantPassword = req.body.Password;
    const TenantContact = req.body.Contact;
    const TenantType = req.body.TenantType;
    const TenantInsert = "INSERT INTO tenant(TenantName, TenantEmail, TenantPassword, TenantContact, TenantType) VALUES (?,?,?,?,?)";
    db.query(TenantInsert, [TenantName, TenantEmail, TenantPassword, TenantContact, TenantType], (err, result) => {
        if (err) throw err;
        console.log(result);
    })
})

//DDL (Data Defination Language Operations)
app.post('/api/create/database', (req, res) => {
    sqlCreate = "Create DATABASE karaydaarhazir.com";
    db.query(sqlCreate, (err, result) => {
        if (err) throw err;
        console.log(result);
    })
});

app.post('/api/create/table', (req, res) => {
    sqlCreate = "CREATE TABLE propertydetail(PropertyID int PRIMARY KEY,PropertyName varchar(255),PropertyType varchar(255),PropertyCategory varchar(255),PropertySpace int,PropertyDescription varchar(255))";
    db.query(sqlCreate, (err, result) => {
        if (err) throw err;
        console.log(result);
    })
})
app.post('/api/drop/table', (req,res)=>{
    sqlDrop = "DROP TABLE propertylisting";
    db.query(sqlDrop, (err,result)=>{
        if (err) throw err;
        console.log(result);
    })
})


app.listen(3001, () => {
    console.log("Running on 3001");
});
