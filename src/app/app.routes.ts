import { Routes } from '@angular/router';
import { LoginComponent } from '../app/page/login/login';
import { RegisterComponent } from '../app/page/register/register';
import { DashboardComponent} from '../app/page/dashboard/dashboard';
import { AuthGuard } from '../app/guards-auth-guard';
import { LayoutComponent} from './page/layout/layout';
import { EmployeeComponent} from '../app/page/employee/employee';
import { ProjectEmployeeComponent} from '../app/page/project-employees/project-employees';
import { ProjectComponent} from '../app/page/project/project';
import { HomeComponent } from './page/home/home';



export const routes: Routes = [
  
    { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

   {
    path: 'layout',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard] },
      { path: 'projects', component: ProjectComponent, canActivate: [AuthGuard] },
      { path: 'project-employee', component: ProjectEmployeeComponent, canActivate: [AuthGuard] }
    ]
  },

  // { path: '**', redirectTo: 'login' }

  
  
];

