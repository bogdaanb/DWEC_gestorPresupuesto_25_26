let presupuesto = 0;

function actualizarPresupuesto(a) {
    if (a >= 0) {
        presupuesto = a;
        return presupuesto;
    } else {
        return -1;
    }
}

function mostrarPresupuesto() {
    return "Tu presupuesto actual es de " + presupuesto + " €";
}

function CrearGasto(descripcion, valor) {
    this.descripcion = descripcion;
    this.valor = valor >= 0 ? valor : 0;

    this.mostrarGasto = function() {
        return "Gasto correspondiente a " + this.descripcion + " con valor " + this.valor + " €";
    };

    this.actualizarDescripcion = function(nuevaDescripcion) {
        this.descripcion = nuevaDescripcion;
    };

    this.actualizarValor = function(nuevoValor) {
        if (nuevoValor >= 0) {
            this.valor = nuevoValor;
        } else {
            console.log("Error: El valor introducido no es válido.");
        }
    };
}

export {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto
}
