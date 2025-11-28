import * as func from "./gestionPresupuesto.js";

function mostrarDatoEnId(idElemento, valor) {
  let textoACambiar = document.getElementById(idElemento);

  textoACambiar.innerText = valor;

  return textoACambiar;
}

function mostrarGastoWeb(idElemento, ...gasto) {
  let arrayGastos = gasto[0];
  let container = document.getElementById(idElemento);
  for (let x = 0; x < arrayGastos.length; x++) {
    let divGastos = document.createElement("div");
    let divGastoDescripcion = document.createElement("div");
    let divGastoFecha = document.createElement("div");
    let divGastoValor = document.createElement("div");
    let divGastoEtiquetas = document.createElement("div");

    for (let i = 0; i < arrayGastos[x].etiquetas.length; i++) {
      let spanEtiquetas = document.createElement("span");
      spanEtiquetas.innerHTML = arrayGastos[x].etiquetas[i];
      divGastoEtiquetas.appendChild(spanEtiquetas);
      spanEtiquetas.className = "gasto-etiquetas-etiqueta";

      let handlerEtiqueta = new BorrarEtiquetaHandle();
      handlerEtiqueta.gasto = arrayGastos[x];
      handlerEtiqueta.etiqueta = arrayGastos[x].etiquetas[i];

      spanEtiquetas.addEventListener("click", handlerEtiqueta);

      divGastoEtiquetas.appendChild(spanEtiquetas);
    }

    divGastos.className = "gasto";
    divGastoDescripcion.className = "gasto-descripcion";
    divGastoFecha.className = "gasto-fecha";
    divGastoValor.className = "gasto-valor";
    divGastoEtiquetas.className = "gasto-etiquetas";

    divGastoDescripcion.innerText = arrayGastos[x].descripcion;
    let date = new Date(arrayGastos[x].fecha);
    divGastoFecha.innerText = date.toLocaleDateString("es-SP");
    divGastoValor.innerText = arrayGastos[x].valor;

    divGastos.appendChild(divGastoDescripcion);
    divGastos.appendChild(divGastoFecha);
    divGastos.appendChild(divGastoValor);
    divGastos.appendChild(divGastoEtiquetas);

    let botonEditar = document.createElement("button");
    botonEditar.type = "button";
    botonEditar.className = "gasto-editar";
    botonEditar.innerText = "Editar";

    let handler = new EditarHandle();
    handler.gasto = arrayGastos[x];

    botonEditar.addEventListener("click", handler);

    divGastos.appendChild(botonEditar);

    let botonBorrar = document.createElement("button");
    botonBorrar.type = "button";
    botonBorrar.className = "gasto-borrar";
    botonBorrar.innerText = "Borrar";

    let handlerBorrar = new BorrarHandle();
    handlerBorrar.gasto = arrayGastos[x];
    botonBorrar.addEventListener("click", handlerBorrar);
    divGastos.appendChild(botonBorrar);

    container.append(divGastos);
  }

  return container;
}

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {
  let container = document.getElementById(idElemento);
  let divPrincipal = document.createElement("div");
  divPrincipal.className = "agrupacion";
  let titulo = "";
  if (periodo === "mes") {
    titulo = "Gastos agrupados por mes";
  } else if (periodo === "dia") {
    titulo = "Gastos agrupados por día";
  } else if (periodo === "anyo") {
    titulo = "Gastos agrupados por año";
  }

  let h1 = document.createElement("h1");
  h1.innerText = titulo;
  divPrincipal.appendChild(h1);
  for (let periodoClave in agrup) {
    let divDato = document.createElement("div");
    divDato.className = "agrupacion-dato";

    let spanClave = document.createElement("span");
    spanClave.className = "agrupacion-dato-clave";
    spanClave.innerText = periodoClave;

    let spanValor = document.createElement("span");
    spanValor.className = "agrupacion-dato-valor";
    spanValor.innerText = agrup[periodoClave];

    divDato.appendChild(spanClave);
    divDato.appendChild(spanValor);
    divPrincipal.appendChild(divDato);

    container.appendChild(divPrincipal);
  }

  return container;
}

function repintar() {
  mostrarDatoEnId("presupuesto", func.mostrarPresupuesto());
  mostrarDatoEnId("gastos-totales", func.calcularTotalGastos());
  mostrarDatoEnId("balance-total", func.calcularBalance());

  let listado = document.getElementById("listado-gastos-completo");
  listado.innerHTML = "";

  mostrarGastoWeb("listado-gastos-completo", func.listarGastos());
}

function actualizarPresupuestoWeb() {
  let promptUsu = prompt("Introduzca un presupuesto", 0);
  let num = Number(promptUsu);
  func.actualizarPresupuesto(num);
  repintar();
}

const boton = document.getElementById("actualizarpresupuesto");
boton.addEventListener("click", actualizarPresupuestoWeb);

function nuevoGastoWeb() {
  let promptDes = prompt("Introduzca una descripción", "Nada");
  let promptVal = prompt("Introduzca un valor", 0);
  let promptFec = prompt("Introduzca un fecha ('Formato yyyy-mm-dd')", 0);
  let promptEti = prompt("Introduzca unas etiquetas('Separados por comas')", 0);

  let numVal = Number(promptVal);
  let arrEti = new Array();
  arrEti = promptEti.split(",");
  let gastoNuevo = new func.CrearGasto(promptDes, numVal, promptFec, arrEti);
  func.anyadirGasto(gastoNuevo);
  repintar();
}

function EditarHandle() {
  this.handleEvent = function (event) {

    let date = new Date();
    let nuevaDescripcion = prompt(
      "Introduzca una descripción",
      this.gasto.descripcion
    );
    let nuevoValor = prompt("Introduzca un valor", this.gasto.valor);
    let nuevaFecha = prompt("Introduzca una fecha (Formato yyyy-mm-dd)",date.toISOString(this.gasto.fecha).split('T')[0]);
    let nuevasEtiquetas = prompt(
      "Introduzca unas etiquetas (separadas por coma)",
      this.gasto.etiquetas
    );

    let numValor = Number(nuevoValor);
    let arrEtiquetas = nuevasEtiquetas.split(",");

    this.gasto.actualizarDescripcion(nuevaDescripcion);
    this.gasto.actualizarValor(numValor);
    this.gasto.actualizarFecha(nuevaFecha);
    this.gasto.anyadirEtiquetas(...arrEtiquetas);

    repintar();
  };
}

function BorrarHandle() {
  this.handleEvent = function (event) {
    func.borrarGasto(this.gasto.id);
    repintar();
  };
}

function BorrarEtiquetaHandle() {
  this.handleEvent = function (event) {
    this.gasto.borrarEtiquetas(this.etiqueta);
    repintar();
  };
}

function nuevoGastoWebFormulario()
{
  let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
  let formulario = plantillaFormulario.querySelector("form");
    
}


const boton2 = document.getElementById("anyadirgasto");
boton2.addEventListener("click", nuevoGastoWeb);

export { mostrarDatoEnId, mostrarGastoWeb, mostrarGastosAgrupadosWeb };
