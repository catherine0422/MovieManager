import { Injectable } from '@angular/core';
import axios from 'axios'
const base="http://localhost:3000/"

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  async getMovies(sort,filter,page){
    console.log("getmovie")
    let url=base+'getpage'
    let params={
      filter:filter,
      page:page,
      sort:sort
    }
    try{
      let res=await axios.get(url,{params})
      console.log(res)
      return res.data
    }catch(err){
      alert(err.message+" please check if you have started server and initialized database")
    }

  }

  async searchMovies(obj){
    console.log("searchmovie")
    let url=base+'search'
    try{
      let res=await axios.post(url,obj)
      return res.data
    }catch(err){
      alert(err.message+" please check if you have started server and initialized database")
    }

  }

  async addMovies(movies){
    let url=base+'add'
    try{
      let res=await axios.post(url,movies)
      return res
    }catch(err){
      alert(err.message+" please check if you have started server and initialized database")
    }

  }

  async deleteMovie(_id){
    console.log("deletemovie")
    let url=base+'del'
    let filter={_id:_id}
    try{
      let res=await axios.post(url,filter)
      return res
    }catch(err){
      alert(err.message+" please check if you have started server and initialized database")
    }

  }

  async updateMovie(_id,movie){
    console.log("updatemovie")
    let url=base+'update'
    let filter={_id:_id}
    let obj={
      filter:{},
      updater:{}
    };
    console.log(obj)
    obj.filter=filter;
    obj.updater=movie;
    try{
      let res=await axios.post(url,obj)
      return res
    }catch(err){
      alert(err.message+" please check if you have started server and initialized database")
    }

  }

  async collectMovie(_id,collectstat){
    console.log("collectmovie")
    let url=base+'update'
    let filter={_id:_id}
    let obj={
      filter:{},
      updater:{}
    };
    obj.filter=filter;
    obj.updater={collected:collectstat};
    try{
      let res=await axios.post(url,obj)
      return res
    }catch(err){
      alert(err.message+" please check if you have started server and initialized database")
    }

  }
}
