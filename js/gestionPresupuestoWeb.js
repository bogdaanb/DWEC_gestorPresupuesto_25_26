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
      spanEtiquetas.className = "gasto-etiquetas-etiqueta"
    }
    
    divGastos.className = "gasto";
    divGastoDescripcion.className = "gasto-descripcion";
    divGastoFecha.className = "gasto-fecha";
    divGastoValor.className = "gasto-valor";
    divGastoEtiquetas.className = "gasto-etiquetas";

    divGastoDescripcion.innerText = arrayGastos[x].descripcion;
    let date = new Date(arrayGastos[x].fecha);
    divGastoFecha.innerText = date.toLocaleDateString('es-SP');
    divGastoValor.innerText = arrayGastos[x].valor;

    divGastos.appendChild(divGastoDescripcion);
    divGastos.appendChild(divGastoFecha);
    divGastos.appendChild(divGastoValor);
    divGastos.appendChild(divGastoEtiquetas);

    container.append(divGastos);
  }

  return container;
}

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {}

export { mostrarDatoEnId, mostrarGastoWeb, mostrarGastosAgrupadosWeb };
