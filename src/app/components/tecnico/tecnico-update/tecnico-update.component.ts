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
import { Tecnico } from "src/app/models/tecnico";
import { TecnicoService } from "src/app/services/tecnico.service";

@Component({
  selector: "app-tecnico-update",
  templateUrl: "./tecnico-update.component.html",
  styleUrls: ["./tecnico-update.component.css"],
})
export class TecnicoUpdateComponent {
  tecnico: Tecnico = {
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
    private service: TecnicoService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxMaskService: NgxMaskService
  ) {}

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get("id");
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe(reposta => {
      reposta.perfis = [];
      this.tecnico = reposta;
    })
  }

  update() {
    //salvar no banco com a mascara telefone
    const valorCampoTel = this.telefone.value;
    const valorFormatadoTel = this.ngxMaskService.applyMask(valorCampoTel, '(00) 00000-0000')
    this.tecnico.telefone = valorFormatadoTel;

    //salvar no banco com a mascara cpf
    const valorCampoCpf = this.cpf.value;
    const valorFormatadoCpf = this.ngxMaskService.applyMask(valorCampoCpf, '000.000.000-00')
    this.tecnico.cpf = valorFormatadoCpf;
    
    this.service.update(this.tecnico).subscribe({
      next: (data) => {
        this.toast.success("Técnico Atualizado com sucesso", "Update");
        this.router.navigate(['tecnicos']);
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
      this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid && this.telefone.valid
    );
  }

  addPerfil(perfil: any): void {
    if (this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    } else {
      this.tecnico.perfis.push(perfil);
    }
  }
}
