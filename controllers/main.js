const fs = require('fs');
const path = require('path');



function writeRecord(id,music,arousal,valence,strongness,likeness,familiarity){
    fs.appendFile("./public/data/"+id+".txt",music+","+arousal+","+valence+","+strongness+","+likeness+","+familiarity+"\n", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

function randomMusic(id){
    var files=allFiles();
    var previouslySelectedFiles=prevSelectedFiles(id);
    files=files.filter(function(file){
        return !previouslySelectedFiles.includes(file);
    });
    return files[Math.floor(Math.random()*files.length)];
}

function allFiles(){
    const files = fs.readdirSync(path.join(__dirname, '../public/music'));
    return files;
}

function prevSelectedFiles(id){
    const files = fs.readFileSync(path.join(__dirname, "../public/data/"+id+".txt"), 'utf8').split('\n').filter(function(line){
        return line.startsWith('Track');
    }).map(function(line){
        return line.split(',')[0];
    });
    return files;
}

function writeHead(timestamp,time,date,age,gender){
    fs.writeFile("./public/data/"+timestamp+".txt","Time :"+time+"\nDate :"+date+"\nAge:"+age+"\nGender:"+gender+"\n\n", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The head of the file saved!");
    });
}
function checkFreeAnnotations(id){
    var files=allFiles();
    var previouslySelectedFiles=prevSelectedFiles(id);
    files=files.filter(function(file){
        return !previouslySelectedFiles.includes(file);
    });
    return files.length;
}
function validate(timestamp){
    const path = './public/data/'+timestamp+'.txt';
    try {
    if (fs.existsSync(path)) {
        return true;
    }
    } catch(err) {
        return false;
    }
}

exports.getMain = (req,res) => {
    res.render('home');
}
exports.postMain = (req,res) => {
    //show the reqest content
    console.log("Data Recived : ", req.body.age, req.body.gender);
    const TimeStamp=Date.now();
    writeHead(TimeStamp,new Date().toLocaleTimeString(),new Date().toLocaleDateString(),req.body.age,req.body.gender);
    res.render('instraction',{id:TimeStamp});
}
exports.getHelp = (req,res) => {
    res.render('instraction-sec');
}
exports.getAnnotation = (req,res) =>{
    const id=req.query.id;
    console.log("Annotation Subject: ",id);
    if (validate(id)){
        const music = randomMusic(id);
        console.log("Annotation Music: ",music);
        res.render("annotation",{id:req.query.id,music:music});
    }
    else{
        res.render("home");
    }
    
}
exports.getArousalAnnotation= (req,res) =>{
    const id=req.query.id;
    const music=req.query.music;
    if (validate(id)){
        console.log("Arousal Annotation Music: ",music);
        res.render("arousalAnnotation",{id:req.query.id,music:music});
    }
    else{
        res.render("home");
    }
}
exports.getAdditionalAnnotations = (req,res) =>{
    const id=req.query.id;
    const music=req.query.music;
    const arousal=req.query.arousal;
    const valence=req.query.valence;
    if (validate(id)){
        res.render("additionalAnnotations",{id:req.query.id,music:music,arousal:arousal,valence:valence});
    }
    else{
        res.render("home");
    }
}
exports.getValenceAnnotation= (req,res) =>{
    const id=req.query.id;
    const music=req.query.music;
    const arousal=req.query.arousal;
    if (validate(id)){
        res.render("valenceAnnotation",{id:req.query.id,music:music,arousal:arousal});
    }
    else{
        res.render("home");
    }
}
exports.getFromEnd= (req,res) =>{
    const id=req.query.id;
    const music=req.query.music;
    const arousal=req.query.arousal;
    const valence=req.query.valence;
    const strongness=req.query.strongness;
    const likeness = req.query.likeness;
    const familiarity = req.query.familiarity;
    const last=req.query.last;
    if (validate(id) && last!="true"){
        writeRecord(id,music,arousal,valence,strongness,likeness,familiarity);
    }
    if (validate(id) && (checkFreeAnnotations(id)==0 || last=="true")){
        res.render("formEnd",{id:id});
    }
    else if (validate(id) && checkFreeAnnotations(id)>=0){
        res.render("musicEnd",{id:id,music:music,noMusic:checkFreeAnnotations(id)});
    }
    else{
        res.render("home");
    }
    
}


exports.doSerial = (req,res) => {
    console.log("Serial Data Recived : ",req);
    const SerialPort = require('serialport').SerialPort;
    const Readline = require('@serialport/parser-readline').ReadlineParser;
    const port = new SerialPort({path:'\\\\.\\COM8',baudRate: 9600 });
    const parser = port.pipe(new Readline({ delimiter: '\n' }));
    const id=req.query.music;
    console.log("Serial Subject: ",id);
    port.write(id);
}