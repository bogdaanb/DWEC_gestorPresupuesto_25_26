import * as funcWeb from "./gestionPresupuestoWeb.js";
import * as func from "./gestionPresupuesto.js";

func.actualizarPresupuesto(1500);
funcWeb.mostrarDatoEnId('presupuesto', func.mostrarPresupuesto());

let gasto1 = func.CrearGasto("Compra carne", 23.44, "2021-10-06", "casa", "comida");
let gasto2 = func.CrearGasto("Compra fruta y verdura", 14.25, "2021-09-06", "supermercado", "comida");
let gasto3 = func.CrearGasto("Bonobús", 18.60, "2020-05-26", "transporte");
let gasto4 = func.CrearGasto("Gasolina", 60.42, "2021-10-08", "transporte", "gasolina");
let gasto5 = func.CrearGasto("Seguro hogar", 206.45, "2021-09-26", "casa", "seguros");
let gasto6 = func.CrearGasto("Seguro coche", 195.78, "2021-10-06", "transporte", "seguros");

func.anyadirGasto(gasto1);
func.anyadirGasto(gasto2);
func.anyadirGasto(gasto3);
func.anyadirGasto(gasto4);
func.anyadirGasto(gasto5);
func.anyadirGasto(gasto6);