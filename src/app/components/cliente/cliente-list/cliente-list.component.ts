import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Cliente } from 'src/app/models/cliente';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {
  jwtService: JwtHelperService = new JwtHelperService();
  ELEMENT_DATA: Cliente[] = []

  displayedColumns: string[] = ['id', 'nome', 'cpf', 'email', 'telefone', 'acoes'];
  dataSource = new MatTableDataSource<Cliente>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private clienteService: ClienteService, private authService: AuthService, private dialog: MatDialog){}


  ngOnInit(): void {
    this.findaAll();
    
  }

  

  

  findaAll(){
    this.clienteService.findAll().subscribe(resposta => {
      this.ELEMENT_DATA = resposta
      this.dataSource = new MatTableDataSource<Cliente>(resposta);
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
    const dialogRef = this.dialog.open(ConfirmarDialogCliente, {
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

export class ConfirmarDialogCliente{
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}





