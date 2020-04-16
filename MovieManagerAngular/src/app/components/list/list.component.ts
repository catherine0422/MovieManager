import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router'
import {HttpService} from '../../service/http.service'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  flag:boolean=false;//show filter

  totalcount:number;
  totalpage:number;
  moviesOnePage:number=3;//show how many movies on one page
  currentpage:number;
  previouspage:number;
  nextpage:number;
  pageset:any[]=[];//paginaition

  allMovies:Array<any>=[];
  movies:Array<any>=[];//the result movies after search 
  thispagemovies:Array<any>=[];//movies show in this page

  query:string;
  type:string="title";//do search with different type
  searchPhrase:string='';//to show how is the current result made

  filter:any={
    Region:{
      Europe:false,
      Asia:false,
      Africa:false,
      Others:false
    },
    Type:{
      Adventure:false,
      Animation:false,
      Comedy:false,
      Documentary:false,
      Romance:false,
      Others:false,
    },
    collected:''
  }

  finalfilter={}//conbine all filter information
  strfinalfilter;

  sort:string="create_time";//sort by some rules, initially set as create time 



  constructor(public route: ActivatedRoute,
    public http:HttpService,
    public router:Router
    ) { 

  }

  ngOnInit(): void {

        this.route.queryParams.subscribe((data)=>{
        console.log(data)
        if(!data.page){
          this.currentpage=1
          this.finalfilter={}
          this.strfinalfilter=JSON.stringify(this.finalfilter)
        }else{
          this.currentpage=parseInt(data.page)
          console.log(data.filter)
         //this.finalfilter=JSON.parse(data.filter)
        }
        this.http.getMovies(this.sort,this.finalfilter,this.currentpage).then(res=>{
          localStorage.setItem("movies",JSON.stringify(res.result))
          console.log(res)
          this.totalcount=res.totalcount
          this.thispagemovies=res.result
          this.init()
          document.querySelector("#list-body").scrollIntoView();
        })
      }
      )

  }



  init(){
    this.totalpage=Math.ceil(this.totalcount/this.moviesOnePage)
    if(this.currentpage==1){
      this.previouspage=1
    }else{
      this.previouspage=this.currentpage-1
    }
    if(this.currentpage==this.totalpage){
      this.nextpage=this.currentpage
    }else{
      this.nextpage=this.currentpage+1
    }
    this.pageset=[]
    if(this.totalpage<7){
      for(let i=0;i<this.totalpage;i++){
        this.pageset.push(i+1)
      }
    }
  }

  collect(i){
    console.log("collecting")
    let movie=this.thispagemovies[i]
    movie.collected=!movie.collected
    this.http.collectMovie(movie._id,movie.collected).then(res=>{
      console.log(res)
    })
  }

  delete(i){
    let movie=this.thispagemovies[i]
    this.http.deleteMovie(movie._id).then(res=>{
      this.http.getMovies(this.sort,this.finalfilter,this.currentpage).then(res=>{
        console.log(res)
        localStorage.setItem("movies",JSON.stringify(res.result))
        this.thispagemovies=res.result
        this.totalcount=res.totalcount
        this.init()
      })
    })
  }

  showfilter(){
    this.flag=!this.flag;
  }

  doSearch(){
    if(!this.query){
      console.log("no input")
    }else{
      console.log(this.type)
      this.finalfilter[this.type]=this.query
      this.strfinalfilter=JSON.stringify(this.finalfilter)
      console.log(this.finalfilter)
      this.http.getMovies(this.sort,this.finalfilter,1).then(res=>{
        console.log(res)
        localStorage.setItem("movies",JSON.stringify(res.result))
        this.currentpage=1
        this.thispagemovies=res.result
        this.totalcount=res.totalcount
        this.init()
        this.finalfilter={}
        this.strfinalfilter=JSON.stringify(this.finalfilter)
        this.searchPhrase+="---"+this.type+": "+this.query;
      })
    }
  }


  runfilter(){
    let regionSelect=[];
    let typeSelect=[];
    for(let key in this.filter.Region){
      if(this.filter.Region[key]){
        regionSelect.push(key)
      }
    }
    for(let key in this.filter.Type){
      if(this.filter.Type[key]){
        typeSelect.push(key)
      }
    }
    if(regionSelect.length>0){
      this.finalfilter['region']={
        $in:regionSelect
      }
    }
    if(typeSelect.length>0){
      this.finalfilter['type']={
        $in:typeSelect
      }
    }
    if(this.filter.collected=="true"){
      this.finalfilter['collected']=true
    }else if(this.filter.collected=="false"){
      this.finalfilter['collected']=false
    }
    if(this.query){
      this.finalfilter[this.type]=this.query
    }
    this.strfinalfilter=JSON.stringify(this.finalfilter)
    this.http.getMovies(this.sort,this.finalfilter,1).then(res=>{
      console.log(res)
      localStorage.setItem("movies",JSON.stringify(res.result))
      this.currentpage=1
      this.thispagemovies=res.result
      this.totalcount=res.totalcount
      this.init()
      this.searchPhrase+="--- Using filter";
    })
  }


  clear(){
    this.finalfilter={}
    this.query=''
    this.filter={
      Region:{
        Europe:false,
        Asia:false,
        Africa:false,
        Others:false
      },
      Type:{
        Adventure:false,
        Animation:false,
        Comedy:false,
        Documentary:false,
        Romance:false,
        Others:false,
      },
      collected:''
    }
    this.searchPhrase=''
    this.flag=false
    this.http.getMovies(this.sort,this.finalfilter,1).then(res=>{
      this.currentpage=1
      localStorage.setItem("movies",JSON.stringify(res.result))
      this.thispagemovies=res.result
      this.totalcount=res.totalcount
      this.init()
    })
  }

  sortRate(ele1,ele2){
    return ele2.rate-ele1.rate
  }

  sortReleaseDate(ele1,ele2){
    let time1=(new Date(ele1.release_date.replace(/-/g,'/'))).getTime()
    let time2=(new Date(ele2.release_date.replace(/-/g,'/'))).getTime()
    return time1-time2
  }

  sortCreateDate(ele1,ele2){
    let time1=(new Date(ele1.create_time.replace(/-/g,'/'))).getTime()
    let time2=(new Date(ele2.create_time.replace(/-/g,'/'))).getTime()
    return time1-time2
  }

  goSort(){
    this.http.getMovies(this.sort,this.finalfilter,1).then(res=>{
      this.currentpage=1
      localStorage.setItem("movies",JSON.stringify(res.result))
      this.thispagemovies=res.result
      this.totalcount=res.totalcount
      this.init()
      console.log(res.result)
    })
  }


}
