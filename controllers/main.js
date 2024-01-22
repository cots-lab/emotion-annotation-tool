const fs = require('fs');
const path = require('path');

function selectFive(){
    var files=allFiles();
    var selectedFiles = [];
    // console.log(files.length);
    while (selectedFiles.length < 5) {
        var selectedFile = files[Math.floor(Math.random()*allFiles().length)];
        if(!selectedFiles.includes(selectedFile)){
            selectedFiles.push(selectedFile);
        }
    }
    // console.log(selectedFiles);
    return selectedFiles;
}

function writeRecord(id,music,arousal,valence,strongness,likeness,familiarity,tool){
    fs.appendFile("./public/data/"+tool+"/"+id+".txt",music+","+arousal+","+valence+","+strongness+","+likeness+","+familiarity+"\n", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

function randomMusic(id,tool){
    // var files=allFiles();
    var files = fs.readFileSync(path.join(__dirname, "../public/data/"+tool+"/"+id+".txt"), 'utf8').split('\n').filter(function(line){
        return line.startsWith('Musics');
    }).map(function(line){
        var tracks = line.split(',');
        tracks = tracks.map(track => track.replace(/^Musics:/, ''));
        return tracks;
    });
    console.log(files[0]);
    var previouslySelectedFiles=prevSelectedFiles(id,tool);
    files=files[0].filter(function(file){
        return !previouslySelectedFiles.includes(file);
    });
    return files[Math.floor(Math.random()*files.length)];
}

function allFiles(){
    const files = fs.readdirSync(path.join(__dirname, '../public/music'));
    return files;
}

function prevSelectedFiles(id,tool){
    const files = fs.readFileSync(path.join(__dirname, "../public/data/"+tool+"/"+id+".txt"), 'utf8').split('\n').filter(function(line){
        return line.startsWith('Track');
    }).map(function(line){
        return line.split(',')[0];
    });
    return files;
}

function writeHead(timestamp,time,date,age,gender,tool){
    fs.writeFile("./public/data/"+tool+"/"+timestamp+".txt","Time :"+time+"\nDate :"+date+"\nAge:"+age+"\nGender:"+gender+"\nMusics:"+selectFive()+"\n\n", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The head of the file saved!");
    });
}

function writeHeadCots(timestamp,time,date,age,gender,tool){
    var tracks = fs.readFileSync(path.join(__dirname, "../public/data/sam/"+timestamp+".txt"), 'utf8').split('\n').filter(function(line){
        return line.startsWith('Musics');
    }).map(function(line){
        return line;
    });
    console.log(tracks);
    fs.writeFile("./public/data/"+tool+"/"+timestamp+".txt","Time :"+time+"\nDate :"+date+"\nAge:"+age+"\nGender:"+gender+"\n"+tracks+"\n\n", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The head of the file saved!");
    });
}

function checkFreeAnnotations(id,tool){
    var files = fs.readFileSync(path.join(__dirname, "../public/data/"+tool+"/"+id+".txt"), 'utf8').split('\n').filter(function(line){
        return line.startsWith('Musics');
    }).map(function(line){
        var tracks = line.split(',');
        tracks = tracks.map(track => track.replace(/^Musics:/, ''));
        return tracks;
    });
    var previouslySelectedFiles=prevSelectedFiles(id,tool);
    files=files[0].filter(function(file){
        return !previouslySelectedFiles.includes(file);
    });
    return files.length-1;
}

function validate(timestamp,tool){
    const path = './public/data/'+tool+"/"+timestamp+'.txt';
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
    const id = req.query.id;

    var age = fs.readFileSync(path.join(__dirname, "../public/data/sam/"+id+".txt"), 'utf8').split('\n').filter(function(line){
        return line.startsWith('Age');
    }).map(function(line){
        var samAge = line.split(':');
        return samAge[1];
    });

    var gender = fs.readFileSync(path.join(__dirname, "../public/data/sam/"+id+".txt"), 'utf8').split('\n').filter(function(line){
        return line.startsWith('Gender');
    }).map(function(line){
        var samGender = line.split(':');
        return samGender[1];
    });

    console.log("Data Recived : ", age[0], gender[0]);
    writeHeadCots(id,new Date().toLocaleTimeString(),new Date().toLocaleDateString(),age[0],gender[0],"cots");
    res.render('instraction',{id:id});
}

exports.getHelp = (req,res) => {
    res.render('instraction-sec');
}

exports.getAnnotation = (req,res) =>{
    const id=req.query.id;
    console.log("Annotation Subject: ",id);
    if (validate(id,"cots")){
        const music = randomMusic(id,"cots");
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
    if (validate(id,"cots")){
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
    if (validate(id,"cots")){
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
    if (validate(id,"cots")){
        console.log("Valance Annotation Music: ",music);
        res.render("valenceAnnotation",{id:req.query.id,music:music,arousal:arousal});
    }
    else{
        res.render("home");
    }
}

exports.getFromEnd = (req,res) =>{
    const id=req.query.id;
    const music=req.query.music;
    const arousal=req.query.arousal;
    const valence=req.query.valence;
    const strongness=req.query.strongness;
    const likeness = req.query.likeness;
    const familiarity = req.query.familiarity;
    const last=req.query.last;
    if (validate(id,"cots") && last!="true"){
        writeRecord(id,music,arousal,valence,strongness,likeness,familiarity,"cots");
    }
    if (validate(id,"cots") && (checkFreeAnnotations(id,"cots")==0 || last=="true")){
        res.render("formEnd",{id:id});
    }
    else if (validate(id,"cots") && checkFreeAnnotations(id,"cots")>=0){
        res.render("musicEnd",{id:id,music:music,noMusic:checkFreeAnnotations(id,"cots")});
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


// SAM Annotation Tool

exports.samPostMain = (req,res) => {
    //show the reqest content
    console.log("Data Recived : ", req.body.age, req.body.gender);
    const TimeStamp=Date.now();
    writeHead(TimeStamp,new Date().toLocaleTimeString(),new Date().toLocaleDateString(),req.body.age,req.body.gender,"sam");
    res.render('samInstraction',{id:TimeStamp});
}

exports.samGetHelp = (req,res) => {
    res.render('samInstraction-sec');
}

exports.samGetAnnotation = (req,res) =>{
    const id=req.query.id;
    console.log("Annotation Subject: ",id);
    if (validate(id,"sam")){
        const music = randomMusic(id,"sam");
        console.log("Annotation Music: ",music);
        res.render("samAnnotation",{id:req.query.id,music:music});
    }
    else{
        res.render("home");
    }
}

exports.samGetArousalAnnotation= (req,res) =>{
    const id=req.query.id;
    const music=req.query.music;
    if (validate(id,"sam")){
        console.log("Arousal Annotation Music: ",music);
        res.render("samArousalAnnotation",{id:req.query.id,music:music});
    }
    else{
        res.render("home");
    }
}

exports.samGetAdditionalAnnotations = (req,res) =>{
    const id=req.query.id;
    const music=req.query.music;
    const arousal=req.query.arousal;
    const valence=req.query.valence;
    if (validate(id,"sam")){
        res.render("samAdditionalAnnotations",{id:req.query.id,music:music,arousal:arousal,valence:valence});
    }
    else{
        res.render("home");
    }
}

exports.samGetValenceAnnotation= (req,res) =>{
    const id=req.query.id;
    const music=req.query.music;
    const arousal=req.query.arousal;
    if (validate(id,"sam")){
        console.log("Valance Annotation Music: ",music);
        res.render("samValenceAnnotation",{id:req.query.id,music:music,arousal:arousal});
    }
    else{
        res.render("home");
    }
}

exports.samGetFromEnd = (req,res) =>{
    const id=req.query.id;
    const music=req.query.music;
    const arousal=req.query.arousal;
    const valence=req.query.valence;
    const strongness=req.query.strongness;
    const likeness = req.query.likeness;
    const familiarity = req.query.familiarity;
    const last=req.query.last;
    if (validate(id,"sam") && last!="true"){
        writeRecord(id,music,arousal,valence,strongness,likeness,familiarity,"sam");
    }
    if (validate(id,"sam") && (checkFreeAnnotations(id,"sam")==0 || last=="true")){
        res.render("samFormEnd",{id:id});
    }
    else if (validate(id,"sam") && checkFreeAnnotations(id,"sam")>=0){
        res.render("samMusicEnd",{id:id,music:music,noMusic:checkFreeAnnotations(id,"sam")});
    }
    else{
        res.render("home");
    }
    
}