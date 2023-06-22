import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { ChamadoService } from 'src/app/services/chamado.service';
import { History } from 'src/app/models/history';
import { KeyValuePipe } from '@angular/common';


@Component({
  selector: 'app-chamado-read',
  templateUrl: './chamado-read.component.html',
  styleUrls: ['./chamado-read.component.css']
})
export class ChamadoReadComponent {
  registrosUpdate: History[];
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

  constructor(private chamadoService: ChamadoService,
              private toastService: ToastrService,
              private route: ActivatedRoute){}
  
  ngOnInit(){
    this.chamado.id = this.route.snapshot.paramMap.get('id');
    this.findById();
    this.findByIdUpdate();
    
  }

  findById() : void {
    this.chamadoService.findById(this.chamado.id).subscribe(resposta => {
      this.chamado = resposta;
    }, ex => {
      this.toastService.error(ex.error.error);
    })
  }

  findByIdUpdate() : void {
    this.chamadoService.findRegistrosUpdateById(this.chamado.id).subscribe(registros => {
      this.registrosUpdate = registros;
      
    }, ex => {
      this.toastService.error(ex.error.error);
    })
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
