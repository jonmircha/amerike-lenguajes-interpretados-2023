import { app } from "./modules/config-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
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
let refCities = ref(db, "cities");
let $fragment = document.createDocumentFragment();
let $template = document.querySelector("#template-city").content;

function renderCities() {
  onValue(refCities, (snapshot) => {
    $table.querySelector("tbody").innerHTML = "";

    snapshot.forEach((el) => {
      //console.log(el);
      //console.log(el.key);
      //console.log(el.val());

      let key = el.key,
        values = el.val();

      $template.querySelector(".key-id").id = key;
      $template.querySelector(".key").innerText = key;
      $template.querySelector(".country").innerText = values.country;
      $template.querySelector(".city").innerText = values.city;

      let $clone = document.importNode($template, true);
      $fragment.appendChild($clone);
    });

    $table.querySelector("tbody").appendChild($fragment);
  });
}

document.addEventListener("DOMContentLoaded", (e) => renderCities());

document.addEventListener("click", (e) => {
  if (!e.target.matches(".edit") && !e.target.matches(".delete")) {
    return false;
  }

  if (e.target.matches(".edit")) {
    //alert("Editar");
    let $parent = e.target.parentElement.parentElement;
    $form.country.value = $parent.querySelector(".country").innerText;
    $form.city.value = $parent.querySelector(".city").innerText;
    $form.key.value = $parent.id;
  }

  if (e.target.matches(".delete")) {
    //alert("Eliminar");
    let key = e.target.parentElement.parentElement.id;
    let deleteId = confirm(`¿Estás seguro de eliminar el id ${key}?`);

    if (deleteId) {
      remove(ref(db, `/cities/${key}`));
    }
  }
});

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
    update(ref(db), {
      [`/cities/${key.value}`]: values,
    });
  }

  $form.reset();
});

/* Codigo Autenticación */
const d = document;
const auth = getAuth(app);
let $appAuthEmail = d.getElementById("app-auth-email");

onAuthStateChanged(auth, (user) => {
  console.log(user);

  if (user) {
    //console.log("Usuario Autenticado");
    $appAuthEmail.innerHTML = `
        <p>Si ves este contenido es porque estás logueado</p>
        <button id="logout">Salir</button>
      `;
  } else {
    //console.log("Usuario NO Autenticado");
    $appAuthEmail.innerHTML = `<p>El contenido de esta sección es exclusivo para usuarios registrados</p>`;
  }
});

d.addEventListener("submit", (e) => {
  e.preventDefault();
  let $form = e.target;

  if ($form.matches("#form-signin")) {
    alert("Creando Cuenta");
    //console.log(form.nombre.value, form.email.value, form.pass.value);

    createUserWithEmailAndPassword(auth, $form.email.value, $form.pass.value)
      .then((res) => {
        //console.log(res);
        $appAuthEmail.innerHTML = `<p>Usuario creado con el correo <b>${$form.email.value}</b></p>`;
        $form.reset();
      })
      .catch((err) => {
        //console.log(err);
        $appAuthEmail.innerHTML = `<p>Ocurrio un error al crear la cuenta <b>${err.message}</b></p>`;
        $form.nombre.focus();
      });
  }

  if ($form.matches("#form-login")) {
    alert("Iniciando Sesión");

    signInWithEmailAndPassword(auth, $form.email.value, $form.pass.value)
      .then((res) => {
        //console.log(res);
        $appAuthEmail.innerHTML = `<p>Usuario logueado con el correo <b>${$form.email.value}</b></p>`;
        $form.reset();
      })
      .catch((err) => {
        //console.log(err);
        $appAuthEmail.innerHTML = `<p>Ocurrio un error al iniciar sesión <b>${err.message}</b></p>`;
        $form.pass.focus();
      });
  }
});

d.addEventListener("click", (e) => {
  if (e.target.matches("#logout")) {
    alert("Cerrando sesión");
    signOut(auth);
  }
});
