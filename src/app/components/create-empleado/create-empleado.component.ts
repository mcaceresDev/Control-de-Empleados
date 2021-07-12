import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado: FormGroup;
  submitted = false;
  loading = false;
  id:string | null;
  Titulo = 'Agregar Empleado';

  constructor(private fb: FormBuilder,
              private _empleadoService: EmpleadoService,
              private router:Router,
              private toastr: ToastrService,
              private aRoute: ActivatedRoute) { 
    this.createEmpleado = this.fb.group({
      nombre: ['', Validators.required],// En caso de querer validar mas cosas incluimos Validator dentro de un array y separamos por , las demas propiedades --> Validator.otracosa, etc
      apellido: ['', Validators.required],
      cedula: ['', Validators.required],
      salario: ['', Validators.required]
    })

    this.id = this.aRoute.snapshot.paramMap.get('id');

   }

  ngOnInit(): void {
    this.editarEmpleado();
  }

  validaAccion(){
    this.submitted = true;

    if (this.createEmpleado.invalid) {
      return;
    }
    if (this.id === null) {
      this.agregarEmpleado();
    } else {
      this.edita(this.id);
    }
  }


  agregarEmpleado() {
    
    const empleado:any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      cedula: this.createEmpleado.value.cedula,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }

    this.loading = true;

    this._empleadoService.agregarEmpleado(empleado).then(() => {
      this.toastr.success('Empleado registrado con exito', 'Empleado Registrado', {
        positionClass: 'toast-bottom-right'
      });

      this.loading = false;
      this.router.navigate(['/list-empleados']);
    })
    .catch((error) => {
      console.log(error);
      this.loading = false;
     });
    // console.log(empleado);
  }

  edita(id:string){
    
    const empleado:any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      cedula: this.createEmpleado.value.cedula,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date()
    }

    this.loading = true;

    this._empleadoService.actualizarEmpleado(id, empleado).then(() => {
      this.loading =false;
      this.toastr.info('El empleado fue modificado con éxito', 'Empleado Modificado', {
        positionClass: 'toast-bottom-right'
      })
      this.router.navigate(['/list-empleados']);
    })
  }

  editarEmpleado(){
    this.Titulo = 'Editar Empleado';
    if(this.id !== null){
      this._empleadoService.getInfo(this.id).subscribe(datos => {
        console.log(datos);
        this.createEmpleado.setValue({
          nombre: datos.payload.data()['nombre'],
          apellido: datos.payload.data()['apellido'],
          cedula: datos.payload.data()['cedula'],
          salario: datos.payload.data()['salario']
        })
      })
    }
  }




}
