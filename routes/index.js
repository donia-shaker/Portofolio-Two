var express = require("express");
var router = express.Router();
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const Experiance = require("./../public/js/experiance");
const Skills = require("./../public/js/skills");
const Services = require("./../public/js/services");
const Mywork = require("./../public/js/mywork");
const Landing = require("./../public/js/landings");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype == "image/png") cb(null, "public/images/");
    else if (file.mimetype == "image/jpeg") cb(null, "public/images/");
    else if (file.mimetype == "routerlication/pdf") cb(null, "public/pdf/");
  },
  filename: (req, file, cb) => {
    var extension = file.originalname.split(".");
    var ext = extension[extension.length - 1];

    var uploaded_file_name =
      file.fieldname +
      "-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "." +
      ext;

    cb(null, uploaded_file_name);
  },
});

const upload = multer({
  storage: storage,

  fileFilter: (req, file, callback) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "routerlication/pdf"
    ) {
      callback(null, true);
    } else callback(null, false);
  },
  limits: 1024 * 1024 * 5,
});

mongoose
  .connect("mongodb://localhost:27017/portofolio")
  .then(result => {
    // console.log(result);
  })
  .catch(error => {
    console.log(error);
  });

// Authentication
router.post("/authentication/login", (req, res) => {
  Landing.find({ is_active: 1 })
    .then(reslut => {
      console.log(reslut);
      var email = req.body.email;
      var password = req.body.password;
      console.log(email);
      console.log(password);

      if (
        email == reslut[reslut.length - 1].email &&
        password == reslut[reslut.length - 1].password
      ) {
        res.redirect("/dashboard");
      } else res.redirect("/404");
    })
    .catch(error => {
      console.log(error);
    });
});

// Landing
router.get("/dashboard", (req, res) => {
  Landing.count({}, function(error, numOfDocs) {
    console.log('I have '+numOfDocs+' documents in my collection');
    // ..
  if (numOfDocs){     
    Landing.find({ is_active: 1 })
      .then(reslut => {
        console.log(reslut);
        res.render("dashboard", { landing: reslut });
      })
      .catch(error => {
        console.log('error');
      });
    } else{
      const i = new Landing({
        name: 'name',
        description: 'description',
        email: 'email@gmail.com',
        password:'password',
        image: '11.jpg',
        // cv: req.files["cv"][0].filename,
      });
      i.save((error, result) => {
        if (error) console.log(error);
        else console.log(result);
        res.render("dashboard", { landing: result });
      });
    }
  });

  });
  router.post(
    "/landing/update",
    upload.fields([{ name: "image" }, { name: "cv" }]),
    function (req, res) {
      const i = new Landing({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        password: req.body.password,
        image: req.files["image"][0].filename,
        cv: req.files["cv"][0].filename,
      });
      i.save((error, result) => {
        if (error) console.log(error);
        else console.log(result);
      });
      // console.log(req.files["cv"][0].filename);
      res.redirect("/dashboard");
      console.log("data inserted successful");
  }
);

//Add Skills
router.get("/skills", (req, res) => {
  Skills.find({ is_active: 1 })
    .then(reslut => {
      res.render("skills", { skills: reslut });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/skills/add", upload.single("image"), (req, res) => {
  console.log(req.body);
  const s = new Skills({
    name: req.body.name,
    image: req.file.filename,
  });
  s.save((error, result) => {
    if (error) console.log(error.message);
    else console.log(result);
  });

  console.log("data inserted successful");
  res.redirect("/skills");
});

// Update Skill
router.post("/skills/update/", upload.single("image"), (req, res, next) => {
  var id = req.body.id;

  console.log(req.body.id);

  Skills.updateOne(
    { _id: id },
    { name: req.body.name, image: req.file.filename },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated Docs : ", docs);
      }
    }
  );

  res.redirect("/skills");
});

// delete Skill
router.post("/skills/delete/", (req, res, next) => {
  var id = req.body.id;
  console.log(req.body.id);

  Skills.updateOne({ _id: id }, { is_active: 0 }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Updated Docs : ", docs);
    }
  });
  res.redirect("/skills");
});

//Add Experiance
router.get("/experiance", (req, res) => {
  Experiance.find({ is_active: 1 })
    .then(reslut => {
      res.render("experiance", { experiance: reslut });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/experiance/add", upload.single("image"), (req, res) => {
  console.log(req.body);
  const e = new Experiance({
    name: req.body.name,
    place: req.body.place,
    start: req.body.start,
    end: req.body.end,
    image: req.file.filename,
  });
  e.save((error, result) => {
    if (error) console.log(error.message);
    else console.log(result);
  });

  console.log("data inserted successful");
  res.redirect("/experiance");
});

// Update Experiance
router.post("/experiance/update/", upload.single("image"), (req, res, next) => {
  var id = req.body.id;

  console.log(req.body.id);

  Experiance.updateOne(
    { _id: id },
    { name: req.body.name, image: req.file.filename },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated Docs : ", docs);
      }
    }
  );
  res.redirect("/experiance");
  alert("You add Successful");
});

// delete experiance
router.post("/experiance/delete/", (req, res, next) => {
  var id = req.body.id;

  console.log(req.body.id);

  Experiance.updateOne({ _id: id }, { is_active: 0 }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Updated Docs : ", docs);
    }
  });
  res.redirect("/experiance");
});

//Add Services
router.get("/services", (req, res) => {
  Services.find({ is_active: 1 })
    .then(reslut => {
      res.render("d-services", { services: reslut });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/services/add", (req, res) => {
  console.log(req.body);
  const serv = new Services({
    name: req.body.name,
    description: req.body.description,
  });
  serv.save((error, result) => {
    if (error) console.log(error.message);
    else console.log(result);
  });

  console.log("data inserted successful");
  res.redirect("/services");
});

// Update Servicess
router.post("/services/update/", (req, res, next) => {
  var id = req.body.id;

  console.log(req.body.id);

  Services.updateOne(
    { _id: id },
    { name: req.body.name, description: req.body.description },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated Docs : ", docs);
      }
    }
  );
  res.redirect("/services");
});

// delete Services
router.post("/services/delete/", (req, res, next) => {
  var id = req.body.id;

  console.log(req.body.id);

  Services.updateOne({ _id: id }, { is_active: 0 }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Updated Docs : ", docs);
    }
  });
  res.redirect("/services");
});

//Add myworks
router.get("/mywork", (req, res) => {
  Mywork.find({ is_active: 1 })
    .then(reslut => {
      res.render("mywork", { mywork: reslut });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/mywork/add", upload.single("image"), (req, res) => {
  console.log(req.body);
  const w = new Mywork({
    url: req.body.url,
    image: req.file.filename,
  });
  w.save((error, result) => {
    if (error) console.log(error.message);
    else console.log(result);
  });

  console.log("data inserted successful");
  res.redirect("/mywork");
});

// Update Experiance
router.post("/mywork/update/", upload.single("image"), (req, res, next) => {
  var id = req.body.id;

  console.log(req.body.id);

  Mywork.updateOne(
    { _id: id },
    { url: req.body.url, image: req.file.filename },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated Docs : ", docs);
      }
    }
  );
  res.redirect("/mywork");
});

// delete Works
router.post("/mywork/delete/", (req, res, next) => {
  var id = req.body.id;

  console.log(req.body.id);

  Mywork.updateOne({ _id: id }, { is_active: 0 }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Updated Docs : ", docs);
    }
  });
  res.redirect("/mywork");
});

router.get("/", async function (req, res, next) {
  var landing;
  await Landing.find({ is_active: 1 }).then(result => {
    landing = result;
  });
  var skills;
  await Skills.find({ is_active: 1 }).then(result => {
    skills = result;
  });
  var experiance;
  await Experiance.find({ is_active: 1 }).then(result => {
    experiance = result;
  });
  var services;
  await Services.find({ is_active: 1 }).then(result => {
    services = result;
  });
  var mywork;
  await Mywork.find({ is_active: 1 }).then(result => {
    mywork = result;
  });

  res.render("index", {
    landing,
    skills,
    experiance,
    services,
    mywork,
  });
});

// router.get("/dashboard", function (req, res, next) {
//   res.render("dashboard", { title: "Express" });
// });
router.get("/404", function (req, res, next) {
  res.render("404", { title: "Express" });
});
router.get("/authentication", function (req, res, next) {
  res.render("authentication", { title: "Express" });
});
router.get("/mywork", function (req, res, next) {
  res.render("mywork", { title: "Express" });
});
router.get("/experiance", function (req, res, next) {
  res.render("experiance", { title: "Express" });
});
router.get("/skills", function (req, res, next) {
  res.render("skills", { title: "Express" });
});
router.get("/services", function (req, res, next) {
  res.render("d-services", { title: "Express" });
});
router.get("/contact", function (req, res, next) {
  res.render("d-contact", { title: "Express" });
});


module.exports = router;
