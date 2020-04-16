import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import { InfoComponent } from './components/info/info.component'
import { EditoldComponent } from './components/editold/editold.component'

const routes: Routes = [
  {
    path:'list',component:ListComponent
  },
  {
    path:'edit/:_id',component:EditComponent
  },
  {
    path:'info/:_id',component:InfoComponent
  },
  {
    path:'editold/:_id',component:EditoldComponent
  },
  {
    path:'**',redirectTo:'/list'
  },
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
