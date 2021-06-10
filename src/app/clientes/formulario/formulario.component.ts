import { Component, OnInit } from '@angular/core';
import { Cliente } from '../shared/cliente';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CepServiceService } from 'src/app/cep-service.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  formCliente!: FormGroup;
  regexCPF = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
  regexCNPJ = /[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}/;
  regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private formBuilder: FormBuilder,
    private cepsService: CepServiceService
    ) { }

  ngOnInit() {
    this.createForm(new Cliente());    
    console.log(this.formCliente.value);
  }

  createForm(cliente: Cliente) {
    this.formCliente = this.formBuilder.group({
      tipo: [cliente.tipo],
      cpf: [cliente.cpf, Validators.pattern(this.regexCPF)],
      cnpj: [cliente.cnpj, Validators.pattern(this.regexCNPJ)],
      nome: [cliente.nome],
      razaoSocial: [cliente.razaoSocial],
      email: [cliente.email, Validators.pattern(this.regexEmail)],
      cep: [cliente.cep],
      endereco: [cliente.endereco],
      bairro: [cliente.bairro],
      cidade: [cliente.cidade],
      estado: [cliente.estado]
    })
  }

  onSubmit() {
    console.log(this.formCliente.value);
    this.formCliente.reset(new Cliente());
  }

  consultaCEP() {
    const cep = this.formCliente.get("cep")?.value;
    if (cep != null && cep !== '') {
      this.cepsService.buscar(cep).subscribe(dados => this.populaForm(dados));
    }
  }

  populaForm(dados: any) {
    this.formCliente.patchValue({
       endereco: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf
    });
    console.log(this.formCliente.value);
  }

}
