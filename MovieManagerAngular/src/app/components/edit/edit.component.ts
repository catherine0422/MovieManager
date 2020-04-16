import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import {HttpService} from '../../service/http.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  collected:string="false";
  image;
  imageUrl="";
  strStars;
  alert:boolean=false;
  alertMessage:string;
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
  constructor(public http:HttpService,public router:Router) { }

  ngOnInit(): void {
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

  // findMaxId(arr){
  //   if(arr.length>0){
  //     let max=arr[0].id
  //     for(let i=0;i<arr.length;i++){
  //       if(arr[i].id>max){
  //         max=arr[i].id
  //       }
  //     }
  //     return max
  //   }else return null
  // }

  saveData(){
    let date = new Date()
    this.movie.create_time=this.dateFormat("YYYY-mm-dd HH:MM", date)
    let number=localStorage.getItem('number');
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
    this.http.addMovies(this.movie).then(res=>{
      console.log("ok")
      console.log(res)
      this.router.navigate(['/list'], { queryParams: { page: 1 ,filter:{}} });
    })
  
  }

}
