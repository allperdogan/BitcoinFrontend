import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BitcoinGraphComponent } from './components/bitcoin-graph/bitcoin-graph.component';

const routes: Routes = [
  {path:"graph",component:BitcoinGraphComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
