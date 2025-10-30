import * as funcWeb from "./gestionPresupuestoWeb.js";
import * as func from "./gestionPresupuesto.js";

func.actualizarPresupuesto(1500);
funcWeb.mostrarDatoEnId('presupuesto', func.mostrarPresupuesto());

let gasto1 = new func.CrearGasto("Compra carne", 23.44, "2021-10-06", "casa", "comida");
let gasto2 = new func.CrearGasto("Compra fruta y verdura", 14.25, "2021-09-06", "supermercado", "comida");
let gasto3 = new func.CrearGasto("Bonobús", 18.60, "2020-05-26", "transporte");
let gasto4 = new func.CrearGasto("Gasolina", 60.42, "2021-10-08", "transporte", "gasolina");
let gasto5 = new func.CrearGasto("Seguro hogar", 206.45, "2021-09-26", "casa", "seguros");
let gasto6 = new func.CrearGasto("Seguro coche", 195.78, "2021-10-06", "transporte", "seguros");

func.anyadirGasto(gasto1);
func.anyadirGasto(gasto2);
func.anyadirGasto(gasto3);
func.anyadirGasto(gasto4);
func.anyadirGasto(gasto5);
func.anyadirGasto(gasto6);

funcWeb.mostrarDatoEnId('gastos-totales',func.calcularTotalGastos());
funcWeb.mostrarDatoEnId('balance-total',func.calcularBalance());
funcWeb.mostrarGastoWeb('listado-gastos-completo',func.listarGastos());
funcWeb.mostrarGastoWeb('listado-gastos-filtrado-1', func.filtrarGastos({fechaDesde: "2021-9-01", fechaHasta: "2021-9-30"}));
funcWeb.mostrarGastoWeb('listado-gastos-filtrado-2', func.filtrarGastos({valorMinimo: 50}));
funcWeb.mostrarGastoWeb('listado-gastos-filtrado-3', func.filtrarGastos({valorMinimo: 200, etiquetasTiene: ["seguros"]}));
funcWeb.mostrarGastoWeb('listado-gastos-filtrado-4', func.filtrarGastos({valorMaximo: 50, etiquetasTiene: ["transporte", "comida"]}));

