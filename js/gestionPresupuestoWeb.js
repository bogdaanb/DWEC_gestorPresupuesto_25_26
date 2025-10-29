function mostrarDatoEnId(idElemento, valor) {
    let textoACambiar = document.getElementById(idElemento);

    textoACambiar.innerText = valor;

    return textoACambiar;
    
}

function mostrarGastoWeb(idElemento, gasto) {
    let container = document.getElementById(idElemento);
    let div = container.innerHTML('<div class="gasto">')


}

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {}

export { mostrarDatoEnId, mostrarGastoWeb, mostrarGastosAgrupadosWeb };

