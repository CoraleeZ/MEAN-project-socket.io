import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectComponent } from './select/select.component';
import { GamepageComponent } from './gamepage/gamepage.component';

const routes: Routes = [
{ path: 'select', component: SelectComponent },
{ path: 'game', component: GamepageComponent },
{ path: '', pathMatch: 'full', redirectTo: 'select' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
