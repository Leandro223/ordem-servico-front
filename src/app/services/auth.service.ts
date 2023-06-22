import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credenciais } from '../models/credenciais';
import { API_CONFIG } from '../config/api.config';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) { }

  authenticated(creds: Credenciais){
    return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, {
      observe: 'response',
      responseType: 'text'
    })
  }

  sucessfullLogin(authToken: string){
    localStorage.setItem('token', authToken);
  }


  isAuthenticated(){
    let token = localStorage.getItem('token');
    if(token != null){
      return !this.jwtService.isTokenExpired(token);
    }
    return false;
  }
  logout(){
    localStorage.clear();
  }

  getUserName(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      return decodedToken.sub; 
    }
    return '';
  }

  getUserRole(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      return decodedToken.role; // Retorna o perfil do usuário
    }
    return '';
  }

}
