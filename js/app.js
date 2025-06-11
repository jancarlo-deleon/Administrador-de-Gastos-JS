//Variables y Selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");
let presupuesto;

//Eventos
eventListeners()
function eventListeners() {

    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

    formulario.addEventListener("submit", agregarGasto);

}

//Clases
class Presupuesto {

    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {

        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();

    }

    calcularRestante() {

        const gastado = this.gastos.reduce((total, gasto) => {

            return total + gasto.cantidad

        }, 0);

        this.restante = this.presupuesto - gastado;

        console.log(restante);

    }

    eliminarGasto(id) {

        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();

    }

}

class UI {

    insertarPresupuesto(cantidad) {
        //Extrayendo valor
        const { presupuesto, restante } = cantidad;
        //Agregando al HTML
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;

    }

    imprimirAlerta(mensaje, tipo) {

        //Crear el div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert");

        if (tipo === "error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }

        //Agregar mensaje
        divMensaje.textContent = mensaje;

        //Insertar en HTML
        document.querySelector(".primario").insertBefore(divMensaje, formulario);

        //Quitar del HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 2000);

    }

    mostrarGastos(gastos) {

        //Limpiar HTML previo
        this.limpiarHTML();

        //Iterar sobre gastos
        gastos.forEach(gasto => {

            const { cantidad, nombre, id } = gasto;

            //Crear un LI
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center"

            nuevoGasto.dataset.id = id;

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `
            
                ${nombre} <span class="badge badge-primary badge-pill">  $${cantidad} </span>

            `;

            //Boton para borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.innerHTML = "Borrar &times";
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agegar al HTML
            gastoListado.appendChild(nuevoGasto);

        });

    }

    limpiarHTML() {

        while (gastoListado.firstChild) {

            gastoListado.removeChild(gastoListado.firstChild);

        }

    }

    actualizarRestante(restante) {

        document.querySelector("#restante").textContent = restante;

    }

    comprobarPresupuesto(presupuestoObj) {

        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector(".restante");

        //comprobar 25%
        if ((presupuesto / 4) > restante) {

            restanteDiv.classList.remove("alert-success", "alert-warning");
            restanteDiv.classList.add("alert-danger");

        } else if ((presupuesto / 2) > restante) {

            restanteDiv.classList.remove("alert-success");
            restanteDiv.classList.add("alert-warning");

        } else {

            restanteDiv.classList.remove("alert-danger","alert-warning");
            restanteDiv.classList.add("alert-success");

        }

        //Si el total es menor a 0 o menor

        if (restante <= 0) {
            this.imprimirAlerta("El presupuesto se ha agotado", "error");

            formulario.querySelector("button[type='submit']").disabled = true;
        }

    }

}

//Instanciar UI
const ui = new UI();

//Funciones
function preguntarPresupuesto() {

    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");

    if (presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    //Presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);

}

function agregarGasto(e) {

    e.preventDefault();

    //Leer los datos del formulario
    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);

    //Validar
    if (nombre === "" || cantidad === "") {

        ui.imprimirAlerta("Ambos campos son obligatorios", "error");
        return;

    } else if (cantidad <= 0 || isNaN(cantidad)) {


        ui.imprimirAlerta("Cantidad NO valida", "error");
        return;

    }

    //Generar un objeto con gasto
    const gasto = { nombre, cantidad, id: Date.now() };

    //Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //Envio de mensaje
    ui.imprimirAlerta("Gasto agregado correctamente");

    //Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //Reiniciar Form
    formulario.reset();

}

function eliminarGasto(id) {
    
    //Elimina de la clase o el objeto
    presupuesto.eliminarGasto(id);

    //Elimina del HTML
    const {gastos,restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

}
