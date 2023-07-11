import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxMaskService } from "ngx-mask";
import { ToastrService } from "ngx-toastr";
import { Cliente } from "src/app/models/cliente";
import { ClienteService } from "src/app/services/cliente.service";

@Component({
  selector: "app-cliente-update",
  templateUrl: "./cliente-update.component.html",
  styleUrls: ["./cliente-update.component.css"],
})
export class ClienteUpdateComponent {
  cliente: Cliente = {
    id: "",
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    telefone: "",
    perfis: [],
    dataCriacao: "",
  };

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));
  telefone: FormControl = new FormControl(null, Validators.required);

  constructor(
    private service: ClienteService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxMaskService: NgxMaskService
  ) {}

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get("id");
    this.findById();
  }

  findById(): void {
    this.service.findById(this.cliente.id).subscribe(reposta => {
      reposta.perfis = [];
      this.cliente = reposta;
    })
  }

  update() {

    //salvar no banco com a mascara telefone
    const valorCampoTel = this.telefone.value;
    const valorFormatadoTel = this.ngxMaskService.applyMask(valorCampoTel, '(00) 00000-0000')
    this.cliente.telefone = valorFormatadoTel;

    //salvar no banco com a mascara cpf
    const valorCampoCpf = this.cpf.value;
    const valorFormatadoCpf = this.ngxMaskService.applyMask(valorCampoCpf, '000.000.000-00')
    this.cliente.cpf = valorFormatadoCpf;
    
    this.service.update(this.cliente).subscribe({
      next: (data) => {
        this.toast.success("Cliente Atualizado com sucesso", "Update");
        this.router.navigate(['clientes']);
      },
      error: (ex) => {
        if (ex.error.errors) {
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
    return (
      this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
    );
  }

  addPerfil(perfil: any): void {
    if (this.cliente.perfis.includes(perfil)) {
      this.cliente.perfis.splice(this.cliente.perfis.indexOf(perfil), 1);
    } else {
      this.cliente.perfis.push(perfil);
    }
  }
}
