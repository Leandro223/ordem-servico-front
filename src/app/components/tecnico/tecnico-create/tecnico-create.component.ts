import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskService } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-create',
  templateUrl: './tecnico-create.component.html',
  styleUrls: ['./tecnico-create.component.css']
})
export class TecnicoCreateComponent implements OnInit{

  //form: FormGroup;
  

  tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    telefone: '',
    perfis: [],
    dataCriacao: ''
  }

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));
  telefone: FormControl<any> = new FormControl(null, Validators.required);

  constructor(private service: TecnicoService,  private toast: ToastrService, private router: Router, private ngxMaskService: NgxMaskService){}


  ngOnInit(): void {
   
  }


    create(){
       //salvar no banco com a mascara telefone
       const valorCampoTel = this.telefone.value;
       const valorFormatadoTel = this.ngxMaskService.applyMask(valorCampoTel, '(00) 00000-0000')
       this.tecnico.telefone = valorFormatadoTel;
 
       //salvar no banco com a mascara cpf
       const valorCampoCpf = this.cpf.value;
       const valorFormatadoCpf = this.ngxMaskService.applyMask(valorCampoCpf, '000.000.000-00')
       this.tecnico.cpf = valorFormatadoCpf;

      this.service.create(this.tecnico)
        .subscribe({
          next: (data) => {
            this.toast.success('Técnico cadastrado com sucesso', 'Cadastro');
            this.router.navigate(['tecnicos']);
          },
          error: (ex) => {
            if (ex.status === 403) {
              this.toast.error("Apenas o administrador está autorizado a criar um tecnico.");
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

  validaCampos(): boolean {
    return this.nome.valid && this.cpf.valid
     && this.email.valid && this.senha.valid && this.telefone.valid
  }

  addPerfil(perfil: any): void {
    

    if(this.tecnico.perfis.includes(perfil)){
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    }else {
      this.tecnico.perfis.push(perfil);
    }
  }

}
