var cuenta = {
    
  titular: "Ash Ketchum ",
  numCuenta: "0987654321 ",
  saldo: 0,
  
  

  ingresar: function(cantidad) {
    console.log("Has ingresado " + cantidad + " dólares");
    return this.saldo += cantidad;
  },

  extraer: function(cantidad) {
    console.log("Has retirado " + cantidad + " dólares");
    return this.saldo -= cantidad;
  },

  informar: function() {
    return "Nombre del titular: " + this.titular + 
           " | El saldo actual de la cuenta es: " + this.saldo + " dólares";
  }
};

var historial = [];

function ingresarDinero() {
  const cantidad = parseFloat(document.getElementById("cantidad").value);
  if (isNaN(cantidad) || cantidad <= 0) {
    swal("Error", "Ingrese una cantidad válida", "error");
    return;
  }

  cuenta.ingresar(cantidad);
  historial.push({
    tipo: "Depósito",
    monto: cantidad,
    fecha: new Date().toLocaleString()
  });

  mostrarInfo();
  swal("Depósito Exitoso", `Se han depositado $${cantidad.toFixed(2)} en la cuenta.`, "success");
}

function retirarDinero() {
  const cantidad = parseFloat(document.getElementById("cantidad").value);
  if (isNaN(cantidad) || cantidad <= 0) {
    swal("Error", "Ingrese una cantidad válida", "error");
    return;
  }
  if (cantidad > cuenta.saldo) {
    swal("Fondos insuficientes", "No puedes retirar más de tu saldo actual.", "warning");
    return;
  }

  // Confirmación antes de retirar
  swal({
    title: "¿Confirmar retiro?",
    text: `Vas a retirar $${cantidad.toFixed(2)}.`,
    icon: "warning",
    buttons: ["Cancelar", "Confirmar"],
    dangerMode: true,
  }).then((confirmado) => {
    if (confirmado) {
      cuenta.extraer(cantidad);
      historial.push({
        tipo: "Retiro",
        monto: cantidad,
        fecha: new Date().toLocaleString()
      });
      mostrarInfo();
      swal("Retiro realizado", `Has retirado $${cantidad.toFixed(2)}.`, "success");
    }
  });
}

function pagarServicio() {
  const servicios = ["Energía eléctrica", "Internet", "Telefonía", "Agua potable"];
  let menu = "Seleccione el servicio que desea pagar:\n";
  for (let i = 0; i < servicios.length; i++) {
    menu += `${i + 1}. ${servicios[i]}\n`;
  }
  const opcion = parseInt(prompt(menu));
  if (isNaN(opcion) || opcion < 1 || opcion > servicios.length) {
    swal("Opción inválida", "Intente de nuevo.", "error");
    return;
  }
  const servicioSeleccionado = servicios[opcion - 1];
  const monto = parseFloat(prompt(`Ingrese el monto a pagar por ${servicioSeleccionado} ($):`));
  if (isNaN(monto) || monto <= 0) {
    swal("Monto inválido", "Intente de nuevo.", "error");
    return;
  }
  if (monto > cuenta.saldo) {
    swal("Fondos insuficientes", "No tiene saldo suficiente para pagar.", "warning");
    return;
  }
  // Confirmación con SweetAlert
  swal({
    title: "Confirmar pago",
    text: `¿Desea pagar $${monto.toFixed(2)} por ${servicioSeleccionado}?`,
    icon: "info",
    buttons: ["Cancelar", "Pagar"],
  }).then((confirmado) => {
    if (confirmado) {
      cuenta.saldo -= monto;
      historial.push({
        tipo: `Pago de ${servicioSeleccionado}`,
        monto: monto,
        fecha: new Date().toLocaleString()
      });
      mostrarInfo();
      swal("Pago realizado", `Pago de ${servicioSeleccionado} por $${monto.toFixed(2)} confirmado.`, "success");
    }
  });
}
let mostrandoSaldo = false; // control del estado (visible / oculto)

function mostrarInfo() {
  const resultado = document.getElementById("resultado");

  // Si NO se está mostrando el saldo, lo mostramos
  if (!mostrandoSaldo) {
    const info = cuenta.informar();
    resultado.innerHTML = `
      <strong>${info}</strong><br>
      <b>Saldo disponible:</b> $${cuenta.saldo.toFixed(2)}
    `;
    resultado.classList.remove("d-none"); // lo hacemos visible
    mostrandoSaldo = true; // marcamos como visible
  } 
  // Si ya se está mostrando, lo ocultamos
  else {
    resultado.innerHTML = ""; 
    resultado.classList.add("d-none"); // lo ocultamos
    mostrandoSaldo = false; // marcamos como oculto
  }
}
