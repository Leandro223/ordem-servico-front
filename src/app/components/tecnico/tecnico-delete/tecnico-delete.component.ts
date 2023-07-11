import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Tecnico } from "src/app/models/tecnico";
import { TecnicoService } from "src/app/services/tecnico.service";

@Component({
  selector: 'app-tecnico-delete',
  templateUrl: './tecnico-delete.component.html',
  styleUrls: ['./tecnico-delete.component.css']
})
export class TecnicoDeleteComponent {
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

  constructor(
    private service: TecnicoService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router
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

  deletar() {
    this.service.deletar(this.tecnico.id).subscribe({
      next: (data) => {
        this.toast.success("Técnico deletado com sucesso", "Delete");
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

}
