import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { Cliente } from 'src/app/models/cliente';
import { Tecnico } from 'src/app/models/tecnico';
import { ChamadoService } from 'src/app/services/chamado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-chamado-delete',
  templateUrl: './chamado-delete.component.html',
  styleUrls: ['./chamado-delete.component.css']
})
export class ChamadoDeleteComponent {

  chamado: Chamado = {
    prioridade: '',
    status: '',
    titulo: '',
    observacoes: '',
    tecnico: '',
    cliente: '',
    nomeCliente: '',
    nomeTecnico: '',
  }

  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];

  constructor(
    private service: ChamadoService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get("id");
    this.findById();
    this.findAllClientes();
    this.findAllTecnicos();
  }

  findById(): void {
    this.service.findById(this.chamado.id).subscribe(reposta => {
      this.chamado = reposta;
    })
  }

  findAllClientes(): void{
    this.clienteService.findAll().subscribe(res => {
      this.clientes = res;
    })
  }

  findAllTecnicos(): void{
    this.tecnicoService.findAll().subscribe(res => {
      this.tecnicos = res;
    });
  }

  deletar() {
    this.service.deletar(this.chamado.id).subscribe({
      next: (data) => {
        this.toast.success("Chamado deletado com sucesso", "Delete");
        this.router.navigate(['chamados']);
      },
      error: (ex) => {
        if (ex.status === 403) {
          this.toast.error("Apenas o administrador está autorizado a excluir o chamado.");
        } else if (ex.error.errors) {
          ex.error.errors.forEach((element) => {
            this.toast.error(element.message);
          });
        } else {
          this.toast.error(ex.error.message);
        }
      },
    });
  }


  retornaStatus(status: any): string {
    if (status == '0') {
      return 'ABERTO'
    }else if (status == '1') {
      return 'EM ANDAMENTO'
    }else {
      return 'ENCERRADO'
    }
  }

  retornaPrioridade(prioridade: any): string {
    if (prioridade == '0') {
      return 'BAIXA'
    }else if (prioridade == '1') {
      return 'MEDIA'
    }else {
      return 'ALTA'
    }
  }

}



