import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";
import {DashboardExchangeComponent} from "./dashboard-exchange.component";
import {BrowserModule} from "@angular/platform-browser";

const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
];

/**
 * The Dashboard module.
 * It provides the splash screen and central control point of the app.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        BrowserModule, // must have this if we do anything with *ngFor, *ngIf etc
        RouterModule.forChild(routes)
    ],
    declarations: [DashboardComponent, DashboardExchangeComponent]
})
export class DashboardModule {
}