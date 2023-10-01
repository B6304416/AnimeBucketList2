import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AnimelistComponent } from './components/animelist/animelist.component'
import { PostAnimeComponent } from './components/post-anime/post-anime.component';
import { MangalistComponent } from './components/mangalist/mangalist.component';
import { AnimereviewComponent } from './components/animereview/animereview.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'animelist', component: AnimelistComponent },
  { path: 'mangalist', component: MangalistComponent },
  { path: 'postanime', component: PostAnimeComponent },
  { path: 'animereview/:id', component: AnimereviewComponent },
  { path: '', redirectTo: '/animelist', pathMatch: 'full' }, // Redirect to the login page by default
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
