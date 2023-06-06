import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    perfis: [],
    dataCriacao: ''
  }

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(private service: TecnicoService,  private toast: ToastrService){}


  ngOnInit(): void {
   
  }


    createDois(){
      this.service.create(this.tecnico)
        .subscribe({
          next: (data) => {
            this.toast.success('Técnico cadastrado com sucesso', 'Cadastro');
          },
          error: (ex) => {
            if(ex.error.errors){
              ex.error.errors.forEach(element => {
                this.toast.error(element.message);
              });
            }else {
              this.toast.error(ex.error.message);
            }
          },
        });
    }

  validaCampos(): boolean {
    return this.nome.valid && this.cpf.valid
     && this.email.valid && this.senha.valid
  }

  addPerfil(perfil: any): void {
    

    if(this.tecnico.perfis.includes(perfil)){
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    }else {
      this.tecnico.perfis.push(perfil);
    }
  }

}
