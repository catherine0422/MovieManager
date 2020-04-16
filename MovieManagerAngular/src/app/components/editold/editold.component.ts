import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import {HttpService} from '../../service/http.service'
import {Router,ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-editold',
  templateUrl: './editold.component.html',
  styleUrls: ['./editold.component.scss']
})
export class EditoldComponent implements OnInit {
  collected:string="false";
  image;
  imageUrl="";
  strStars;
  alert:boolean=false;
  alertMessage:string;
  _id:any;

  movie:any={
    title:"",
    rate:'',
    img:"",
    collected:false,
    // id:'',
    type:"",
    region:'',
    create_time:'',
    director:'',
    writer:"",
    duration:'',
    stars:[],
    synopsis:"",
    review:"",
    release_date:"",
  }
  constructor(public http:HttpService,
    public router:Router,
    public route:ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe((data)=>{
      let movies= JSON.parse(localStorage.getItem('movies'))
      
      let select=movies.find(ele=>{return ele._id==data._id})
      this._id=select._id
      delete select._id
      console.log(select)
      this.movie=select

      
      for(let i=0;i<this.movie.stars.length;i++){
        this.strStars+=this.movie.stars[i]+","
      }
      this.imageUrl=this.movie.img
      document.querySelector("#editold-body").scrollIntoView();
    })

  }
  selectImage(event){
    if(event.target.files.length>0){
      const file=event.target.files[0]
      this.image=file;
    }
  }
  onSubmit(){
    const formData=new FormData()
    formData.append('file',this.image)
    axios.post("http://localhost:3000/upload",formData).then(
      (res)=>{
        console.log(res)
        this.imageUrl=res.data
        this.movie.img=res.data
      },
      (err)=>console.log(err)
    )
  }

  dateFormat(fmt, date) {
      let ret;
      const opt = {
          "Y+": date.getFullYear().toString(),       
          "m+": (date.getMonth() + 1).toString(),     
          "d+": date.getDate().toString(),           
          "H+": date.getHours().toString(),          
          "M+": date.getMinutes().toString(),        
          "S+": date.getSeconds().toString()         
      };
      for (let k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
              fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
          };
      };
      return fmt;
  }

  comma(str){
    console.log(str)
    let arr=str.split(',')
    return arr
  }

  saveData(){
    let date = new Date()
    this.movie.create_time=this.dateFormat("YYYY-mm-dd HH:MM", date)
    if(this.collected=="false"){
      this.movie.collected=false
    }else{
      this.movie.collected=true
    }

    if(!this.strStars){
      this.alert=true
      this.alertMessage="Stars missing"
      return 
    }else{
      this.movie.stars=this.strStars.split(',')
      for(let key  in this.movie){
        if(key!="collected"){
          if(!this.movie[key]){
            this.alert=true
            this.alertMessage=key+" missing"
            return
          }
          if(key=="rate"&&(this.movie[key]<0||this.movie[key]>10)){
            this.alert=true
            this.alertMessage="rate number should be within (0,10)"
            return
          }
        }
      }
    }
    this.alert=false;
    this.http.updateMovie(this._id,this.movie).then(res=>{
      console.log("ok")
      console.log(res)
      this.router.navigate(['/list'], { queryParams: { page: 1 ,filter:{}} });
    })
  }

}
