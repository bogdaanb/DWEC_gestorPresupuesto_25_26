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

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {
    let container = document.getElementById(idElemento);
    let divPrincipal = document.createElement('div');
    divPrincipal.className = "agrupacion";
    let titulo = '';
    if (periodo === "mes") {
        titulo = "Gastos agrupados por mes";
    } else if (periodo === "dia") {
        titulo = "Gastos agrupados por día";
    } else if (periodo === "anyo") {
        titulo = "Gastos agrupados por año";
    }

    let h1 = document.createElement('h1');
    h1.innerText = titulo;
    divPrincipal.appendChild(h1);
    for (let periodoClave in agrup) {
    let divDato = document.createElement('div');
    divDato.className = 'agrupacion-dato';


    let spanClave = document.createElement('span');
    spanClave.className = 'agrupacion-dato-clave';
    spanClave.innerText = periodoClave; 

    let spanValor = document.createElement('span');
    spanValor.className = 'agrupacion-dato-valor';
    spanValor.innerText = agrup[periodoClave]; 


    divDato.appendChild(spanClave);
    divDato.appendChild(spanValor);
    divPrincipal.appendChild(divDato);
    container.appendChild(divPrincipal);
  }

  return container;
}


export { mostrarDatoEnId, mostrarGastoWeb, mostrarGastosAgrupadosWeb };
