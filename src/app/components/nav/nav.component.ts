import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {


  jwtService: JwtHelperService = new JwtHelperService();
  userName: string;


  constructor(private router: Router, private authService: AuthService, private toast: ToastrService){}
  
  ngOnInit(): void {
    this.router.navigate(['home']);
    this.userName = this.authService.getUserName();
  }

  lougout(){
    this.router.navigate(['login']);
    this.authService.logout();
    this.toast.info('Logout realizado com sucesso!', 'Logout', { timeOut: 5000 });
  }

  isAdmin(): boolean {
  const userRoles = this.authService.getUserRole();
  return userRoles.includes('ROLE_ADMIN');
}

}
