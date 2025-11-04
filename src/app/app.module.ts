import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './pages/index/index.component';
import { SongsComponent } from './pages/songs/songs.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';
import { ArtistCardComponent } from './pages/index/artist-card/artist-card.component';
import { LandingComponent } from './pages/landing/landing.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ErrorsComponent } from './components/errors/errors.component';
import { BlacklistCustomizerComponent } from './components/blacklist-customizer/blacklist-customizer.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    SongsComponent,
    PlaylistComponent,
    ArtistCardComponent,
    LandingComponent,
    PrivacyComponent,
    AboutComponent,
    ContactComponent,
    ErrorsComponent,
    BlacklistCustomizerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
