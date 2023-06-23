import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskService } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';




@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent implements OnInit{

  //form: FormGroup;
  

  cliente: Cliente = {
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

  constructor(private service: ClienteService,  private toast: ToastrService, private router: Router, private ngxMaskService: NgxMaskService){}


  ngOnInit(): void {
   
  }
  



    create(){
      //salvar no banco com a mascara telefone
      const valorCampoTel = this.telefone.value;
      const valorFormatadoTel = this.ngxMaskService.applyMask(valorCampoTel, '(00) 00000-0000')
      this.cliente.telefone = valorFormatadoTel;

      //salvar no banco com a mascara cpf
      const valorCampoCpf = this.cpf.value;
      const valorFormatadoCpf = this.ngxMaskService.applyMask(valorCampoCpf, '000.000.000-00')
      this.cliente.cpf = valorFormatadoCpf;
      
      
      this.service.create(this.cliente)
        .subscribe({
          next: (data) => {
            this.toast.success('Cliente cadastrado com sucesso', 'Cadastro');
            this.router.navigate(['clientes']);
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
     && this.email.valid && this.senha.valid && this.telefone.valid
  }

  addPerfil(perfil: any): void {
    

    if(this.cliente.perfis.includes(perfil)){
      this.cliente.perfis.splice(this.cliente.perfis.indexOf(perfil), 1);
    }else {
      this.cliente.perfis.push(perfil);
    }
  }

}
