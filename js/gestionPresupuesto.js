let presupuesto = 0;
let fechaHoy = new Date();

let gastos = [];

let idGasto = 0;

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

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
  this.descripcion = descripcion;
  this.valor = valor >= 0 ? valor : 0;
  let t = parseFecha(fecha);
  this.fecha = isNaN(t) ? fechaHoy.getTime() : t;
  this.etiquetas = etiquetas.length > 0 ? etiquetas : [];

  this.mostrarGastoCompleto = function () {
    return (
      "Gasto correspondiente a " +
      this.descripcion +
      " con valor " +
      this.valor +
      " €.\n" +
      "Fecha: " +
      new Date(this.fecha).toLocaleString() +
      "\nEtiquetas:\n" +
      formatearEtiquetas(this.etiquetas)
    );
  };

  this.actualizarFecha = function (fechaAnyadida) {
    let t = parseFecha(fechaAnyadida);
    if (!isNaN(t)) this.fecha = t;
  };

  this.mostrarGasto = function () {
    return (
      "Gasto correspondiente a " +
      this.descripcion +
      " con valor " +
      this.valor +
      " €"
    );
  };

  this.borrarEtiquetas = function (...etiquetasABorrar) {
    for (let i = 0; i < etiquetasABorrar.length; i++) {
      let index = this.etiquetas.indexOf(etiquetasABorrar[i]);
      if (index !== -1) {
        this.etiquetas.splice(index, 1);
        i--;
      }
    }
  };

  this.actualizarDescripcion = function (nuevaDescripcion) {
    this.descripcion = nuevaDescripcion;
  };

  this.actualizarValor = function (nuevoValor) {
    if (nuevoValor >= 0) {
      this.valor = nuevoValor;
    } else {
      console.log("Error: El valor introducido no es válido.");
    }
  };

  this.anyadirEtiquetas = function (...nuevasEtiquetas) {
    for (let i = 0; i < nuevasEtiquetas.length; i++) {
      if (this.etiquetas.includes(nuevasEtiquetas[i]) == false) {
        this.etiquetas.push(nuevasEtiquetas[i]);
      } else {
        continue;
      }
    }
  };

  this.obtenerPeriodoAgrupacion = function (periodo) {
    let d = formateartPeriodo(this.fecha);
    let str = "";
    switch (periodo) {
      case "anyo":
        str = d.slice(0, 4);
        break;
      case "mes":
        str = d.slice(0, 7);
        break;
      case "dia":
        str = d;
        break;
    }
    return str;
  };
}

function formateartPeriodo(timestamp) {
  const d = new Date(timestamp);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatearEtiquetas(etiquetas) {
  if (!etiquetas || etiquetas.length === 0) return "";
  return etiquetas.map((e) => "- " + e).join("\n") + "\n";
}

function formatearFecha(timestamp) {
  let fecha = new Date(timestamp);
  return fecha.toLocaleString();
}

function listarGastos() {
  return gastos;
}

function anyadirGasto(gasto) {
  gasto.id = idGasto;
  idGasto++;
  gastos.push(gasto);
}

function borrarGasto(id) {
  for (let i = 0; i < gastos.length; i++) {
    if (gastos[i].id == id) {
      gastos.splice(i, 1);
    } else if (gastos[i] == null) {
      return;
    }
  }
}

function calcularTotalGastos() {
  let sumaGastos = 0;
  for (let i = 0; i < gastos.length; i++) {
    sumaGastos = sumaGastos + gastos[i].valor;
  }

  return sumaGastos;
}

function calcularBalance() {
  let balance;

  balance = presupuesto - calcularTotalGastos();
  return balance;
}

function filtrarGastos(filtros = {}) {
  return gastos.filter((gasto) => {
    if (filtros.fechaDesde) {
      let tDesde = parseFecha(filtros.fechaDesde);
      if (!isNaN(tDesde) && gasto.fecha < tDesde) return false;
    }

    if (filtros.fechaHasta) {
      let tHasta = parseFecha(filtros.fechaHasta);
      if (!isNaN(tHasta) && gasto.fecha > tHasta) return false;
    }

    if (
      filtros.valorMinimo !== undefined &&
      gasto.valor < filtros.valorMinimo
    ) {
      return false;
    }

    if (
      filtros.valorMaximo !== undefined &&
      gasto.valor > filtros.valorMaximo
    ) {
      return false;
    }

    if (filtros.descripcionContiene) {
      let filtro = filtros.descripcionContiene.toUpperCase();
      let texto = gasto.descripcion.toUpperCase();
      if (!texto.includes(filtro)) return false;
    }

    if (filtros.etiquetasTiene && filtros.etiquetasTiene.length > 0) {
      let coincide = filtros.etiquetasTiene.some((et) =>
        gasto.etiquetas.includes(et)
      );
      if (!coincide) return false;
    }

    return true;
  });
}

function agruparGastos(
  periodo = "mes",
  etiquetas = [],
  fechaDesde,
  fechaHasta
) {
  let gastosFiltrados = filtrarGastos({
    fechaDesde: fechaDesde,
    fechaHasta: fechaHasta,
    etiquetasTiene: etiquetas,
  });

  return gastosFiltrados.reduce((acc, gasto) => {
    let clave = gasto.obtenerPeriodoAgrupacion(periodo);
    if (!acc[clave]) acc[clave] = 0;
    acc[clave] += gasto.valor;
    return acc;
  }, {});
}

function parseFecha(fechaStr) {
  if (typeof fechaStr !== "string") return NaN;

  if (fechaStr.includes("T")) {
    const t = Date.parse(fechaStr);
    return isNaN(t) ? NaN : t;
  }

  const parts = fechaStr.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return NaN;

    return new Date(year, month - 1, day).getTime();
  }

  return NaN;
}



function transformarListadoEtiquetas(cadenaEtiquetas = "") {
  if (typeof cadenaEtiquetas !== "string") return [];

  return cadenaEtiquetas.split(/[,\.\:;\s]+/).filter(etiqueta => etiqueta.length > 0);
}


function cargarGastos(gastosAlmacenamiento) {
  // gastosAlmacenamiento es un array de objetos "planos"
  // No tienen acceso a los métodos creados con "CrearGasto":
  // "anyadirEtiquetas", "actualizarValor",...
  // Solo tienen guardadas sus propiedades: descripcion, valor, fecha y etiquetas

  // Reseteamos la variable global "gastos"
  gastos = [];
  // Procesamos cada gasto del listado pasado a la función
  for (let g of gastosAlmacenamiento) {
      // Creamos un nuevo objeto mediante el constructor
      // Este objeto tiene acceso a los métodos "anyadirEtiquetas", "actualizarValor",...
      // Pero sus propiedades (descripcion, valor, fecha y etiquetas) están sin asignar
      let gastoRehidratado = new CrearGasto();
      // Copiamos los datos del objeto guardado en el almacenamiento
      // al gasto rehidratado
      // https://es.javascript.info/object-copy#cloning-and-merging-object-assign
      Object.assign(gastoRehidratado, g);
      // Ahora "gastoRehidratado" tiene las propiedades del gasto
      // almacenado y además tiene acceso a los métodos de "CrearGasto"
        
      // Añadimos el gasto rehidratado a "gastos"
      gastos.push(gastoRehidratado)
  }
}
  


export {
  mostrarPresupuesto,
  actualizarPresupuesto,
  CrearGasto,
  listarGastos,
  anyadirGasto,
  borrarGasto,
  calcularTotalGastos,
  calcularBalance,
  filtrarGastos,
  agruparGastos,
  transformarListadoEtiquetas,
  cargarGastos,
};
