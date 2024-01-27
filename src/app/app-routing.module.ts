import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { SongsComponent } from './pages/songs/songs.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';
import { LandingComponent } from './pages/landing/landing.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

const routes: Routes = [
  {path:'', component: LandingComponent},
  {path:'form', component: IndexComponent},
  {path:'songs', component: SongsComponent},
  {path:'playlist', component: PlaylistComponent},
  {path:'about', component: AboutComponent},
  {path:'privacy', component: PrivacyComponent},
  {path:'contact', component: ContactComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
