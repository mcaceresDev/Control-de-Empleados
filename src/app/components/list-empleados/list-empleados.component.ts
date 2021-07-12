import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

// import { AngularFirestore } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit {
  // items: Observable<any[]>;
  empleados:any[] = [];

  constructor(private _empleadoService:EmpleadoService,
                      private toastr: ToastrService) {
    //dentro del constructor -> firestore: AngularFirestore 
    // this.items = firestore.collection('items').valueChanges();
   }

  ngOnInit(): void {
    this.getEmpleados();
  }

  getEmpleados(){
    this._empleadoService.getEmpleados().subscribe(datos => {
      this.empleados = []; 
      // console.log(data);
      // data.map((elementos:any)=>{console.log(elementos.payload.doc.id);
      datos.map((elementos:any)=>{
        // console.log(elementos.payload.doc.data());
          this.empleados.push({
            id: elementos.payload.doc.id,
            ...elementos.payload.doc.data()
          });
      });
      console.log(this.empleados);
      
    });
  }


  eliminarEmpleado(id:string){
    this._empleadoService.deleteEmpleado(id).then(() => {
      console.log('empleado eliminado con exito');
      this.toastr.error('El Empleado ha sido eliminado', 'Registrado Eliminado', {
        positionClass: 'toast-bottom-right'
      });
    }).catch(error => {
      console.log(error);
    })
  }


}
