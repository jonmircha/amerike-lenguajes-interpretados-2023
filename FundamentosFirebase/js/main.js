import { app } from "./modules/config-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
//console.log(app);

const db = getDatabase(app);
//console.log(db);

let $hola = document.querySelector("#hola");

let refMensaje = ref(db, "mensaje");
//console.log(refMensaje);

onValue(refMensaje, (snapshot) => {
  //console.log(snapshot);
  //console.log(snapshot.key, snapshot.val());
  $hola.innerHTML = snapshot.val();
});

/*
  Insertar Datos en Realtime Database
    Tenemos 2 métodos: set y push
    ¿Cuál es la diferencia?
    push autogenera una clave única a la estructura de datos que insertes
  */
/* set(ref(db, "usuariosSet"), {
  nombre: "Jon",
  edad: 39,
});

push(ref(db, "usuariosPush"), {
  nombre: "Jon",
  edad: 39,
}); */

/* CRUD de datos en RealTime Database */
let $table = document.querySelector("#table-cities");
let $form = document.querySelector("#form-cities");

$form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Procesando Formulario");
  //console.log($form.country.value, $form.city.value);

  let key = e.target.key;
  let values = {
    country: $form.country.value,
    city: $form.city.value,
  };
  //console.log(key);

  if (!key.value) {
    //Operación de Inserción de datos
    push(ref(db, "cities"), values);
  } else {
    //Operación de Actualización de datos
  }

  $form.reset();
});
