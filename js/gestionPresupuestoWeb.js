function mostrarDatoEnId(idElemento, valor) {
    let textoACambiar = document.getElementById(idElemento);

    textoACambiar.innerText = valor;

    return textoACambiar;
    
}

function mostrarGastoWeb(idElemento, gasto) {}

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {}

export { mostrarDatoEnId, mostrarGastoWeb, mostrarGastosAgrupadosWeb };

