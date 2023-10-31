import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

export function firebaseCRUD(app) {
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
}
