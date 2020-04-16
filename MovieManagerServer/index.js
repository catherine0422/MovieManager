const express=require('express')
const formidable=require('formidable')
const bodyParser=require('body-parser')
const multer=require('multer')
const ObjectId = require('mongodb').ObjectID;

const app=express()
const DB=require('./db')
const dbMovies=new DB('mongodb://localhost:27017','moviemanager','movies')
const base="http://localhost:3000/image/"

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("X-Powered-By", ' 3.2.1');
    next();
  });

// app.use(bodyParser.json())
app.use(express.static('public'));

app.get('/init',function(req,res){
    
    dbMovies.query().then(result=>{
        res.send(result)
    })
})

app.get('/getpage',function(req,res){
    
    let page=req.query.page
    let filter=req.query.filter
    let sort=req.query.sort
    filter=filter||{}
    dbMovies.getPage(sort,filter,page).then(result=>{
        //console.log(res)
        res.send(result)
    })
})

app.post('/search',function(req,res){
    let form=new formidable.IncomingForm()
    form.parse(req,(err,fields,file)=>{
        console.log(fields)
        dbMovies.query(fields).then(result=>{
            res.send(result)
        })
    })
})

app.post('/add',(req,res)=>{
    let form=new formidable.IncomingForm()
    form.parse(req,(err,fields,file)=>{
        console.log(fields)
        dbMovies.insert(fields,false).then(result=>{
            res.send(result)
        })
    })
})

app.post('/update',(req,res)=>{
    let form=new formidable.IncomingForm()
    form.parse(req,(err,fields,file)=>{
        console.log(fields)
        fields.filter._id=ObjectId(fields.filter._id)
        dbMovies.update(fields.filter,fields.updater).then(result=>{
            console.log(result)
            res.send(result)
        })
    })
})

app.post('/del',(req,res)=>{
    let form=new formidable.IncomingForm()
    form.parse(req,(err,fields,file)=>{
        fields._id=ObjectId(fields._id)
        dbMovies.del(fields,false).then(result=>{
            res.send(result)
        })
    })
})

const storage=multer.diskStorage({
    destination:(req,file,callBack)=>{
        callBack(null,'public/image')
    },
    filename:(req,file,callBack)=>{
        callBack(null,Date.now()+'-' + file.originalname)
    }
})

var upload=multer({storage:storage})

app.post('/upload',upload.single('file'),(req,res,next)=>{
    const file=req.file
    console.log(file.filename)
    if(!file){
        const error="No file"
        error.httpStatusCode=400
        return next(error)
    }
    imageUrl=base+file.filename
    res.send(imageUrl)
})

app.listen(3000,function(){
    console.log('Server listening on port 3000')
})