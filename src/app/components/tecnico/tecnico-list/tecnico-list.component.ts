import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tecnico-list',
  templateUrl: './tecnico-list.component.html',
  styleUrls: ['./tecnico-list.component.css']
})
export class TecnicoListComponent implements OnInit {

  jwtService: JwtHelperService = new JwtHelperService();
  ELEMENT_DATA: Tecnico[] = []

  displayedColumns: string[] = ['id', 'nome', 'cpf', 'email', 'telefone', 'senha', 'acoes'];
  dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private tecnicoService: TecnicoService, private dialog: MatDialog, private router: Router, 
              private authService: AuthService){}


  ngOnInit(): void {
    this.findaAll();
    
  }

  

  

  findaAll(){
    this.tecnicoService.findAll().subscribe(resposta => {
      this.ELEMENT_DATA = resposta
      this.dataSource = new MatTableDataSource<Tecnico>(resposta);
      this.dataSource.paginator = this.paginator;
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  hasAdminRole(): boolean {
    const userRoles = this.authService.getUserRole();
    
    
    return userRoles.includes('ROLE_ADMIN');
  }
  


openDialog(): void {
  if (!this.hasAdminRole()) {
    const dialogRef = this.dialog.open(ConfirmarDialog, {
      width: '250px',
      data: { message: 'Somente o administrador tem permissão para executar esta ação.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Diálogo fechado');
    });
  }
}


}

@Component({
  selector: 'confirmar-dialog',
  template: `
    <h1 mat-dialog-title class="dialog-title">Atenção</h1>
    <div mat-dialog-content class="dialog-content">
      {{ data.message }}
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button [mat-dialog-close]="true" class="confirm-button">Fechar</button>
    </div>
  `,
  styles: [`
    .dialog-title {
      display: flex;
      font-size: 24px;
      color: #333;
      margin-bottom: 20px;
      align-items: center;
      justify-content: center;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: center;
    }
    
    
    .confirm-button {
      background-color: #007bff;
      color: #fff;
      justify-content: center;
      align-items: center;
    }
  `]
})

export class ConfirmarDialog{
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}






