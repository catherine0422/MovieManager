const MongoClient= require('mongodb').MongoClient
const onepagenumber=3

class DB{
    constructor(url,dbName,collectionName){
        this.url=url;
        this.dbName=dbName;
        this.collectionName=collectionName;
    }

    _connect(){
        return new Promise((resolve,reject)=>{
            MongoClient.connect(this.url,{useUnifiedTopology:true},(err,client)=>{
                if(err)return reject(err);
                resolve(client);
            })
        })
    }

    insert(obj,isMany){
        return new Promise((resolve,reject)=>{
            this._connect().then(client=>{
                let db = client.db(this.dbName)
                if(isMany){
                    db.collection(this.collectionName).insertMany(obj).then(res=>{
                        resolve(res)
                        client.close()
                    })
                }else{
                    db.collection(this.collectionName).insertOne(obj).then(res=>{
                        resolve(res)
                        client.close()
                    })
                }
            })
        })
    }

    del(obj,isMany){
        return new Promise((resolve,reject)=>{
            this._connect().then(client=>{
                let db = client.db(this.dbName)
                if(isMany){
                    db.collection(this.collectionName).deleteMany(obj).then(res=>{
                        resolve(res)
                        client.close()
                    })
                }else{
                    db.collection(this.collectionName).deleteOne(obj).then(res=>{
                        resolve(res)
                        client.close()
                    })
                }
            })
        })
    }

    update(filter,updater){
        return new Promise((resolve,reject)=>{
            this._connect().then(client=>{
                let db = client.db(this.dbName)
                let updateCpy={$set:updater};
                db.collection(this.collectionName).updateMany(filter,updateCpy).then(res=>{
                    resolve(res)
                    client.close()
                })
            })
        })
    }

    query(obj){
        obj=obj||{}
        return new Promise((resolve,reject)=>{
            this._connect().then(client=>{
                let db = client.db(this.dbName)
                let queryRes=db.collection(this.collectionName).find(obj).toArray(function(err, result) {
                    if (err) throw err;
                    resolve(result)
                    client.close();
                })
            })
        })

    }
    getPage(sort,filter,page){
        return new Promise((resolve,reject)=>{
            this._connect().then(client=>{
                let db = client.db(this.dbName)
                
                filter=JSON.parse(filter)
                let sortobjet={
                    [sort]:-1
                }
                console.log(sortobjet)
                db.collection(this.collectionName).count(filter).then(res=>{
                    console.log(res)
                    let totalcount=res
                    db.collection(this.collectionName).find(filter).skip((page-1)*onepagenumber).limit(onepagenumber).sort(sortobjet).toArray(function(err, result) {
                        if (err) throw err;
                        let data={
                            result:result,
                            totalcount:totalcount
                        }
                        resolve(data)
                        client.close();
                  });
                })

            })
        })
    }

}

module.exports=DB
// let db=new DB('mongodb://localhost:27017','moviemanager','movies')

// db.query().then(res=>{
//     console.log(res)
// })