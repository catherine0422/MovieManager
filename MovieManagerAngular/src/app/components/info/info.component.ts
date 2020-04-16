import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {HttpService} from '../../service/http.service'

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']

})
export class InfoComponent implements OnInit {
  _id:any;
  movie:any;

  constructor(public route:ActivatedRoute,
    public http:HttpService,
    public router:Router
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe((data)=>{
      this._id=data._id
      
      let movies= JSON.parse(localStorage.getItem('movies'))
      console.log(movies)
      this.movie=movies.find(ele=>{return ele._id==this._id})
      document.querySelector("#info-body").scrollIntoView();
    })
  }
  collect(){
    this.movie.collected=!this.movie.collected
    this.http.collectMovie(this.movie._id,this.movie.collected).then(res=>{
      console.log(res)
    })
  }
  delete(){
    this.http.deleteMovie(this.movie._id).then(res=>{
      console.log(res)
      this.router.navigate(['/init/',1]);
    })
  }

}
