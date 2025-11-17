const pinCorrecto = "1234";

function verificarPin() {
  const pinIngresado = document.getElementById("pin").value.trim();
  const mensaje = document.getElementById("mensajeLogin");



  //  Validación con ValidateJS
  const constraints = {
    pin: {
      presence: { allowEmpty: false, message: "^Debe ingresar un PIN." },
      format: {
        pattern: "^[0-9]{4}$",
        message: "^El PIN debe contener exactamente 4 dígitos numéricos."
      }
    }
  };

  const errores = validate({ pin: pinIngresado }, constraints);

  if (errores) {
    mensaje.textContent = errores.pin[0];
    return;
  }

  if (pinIngresado === pinCorrecto) {
    document.getElementById("login").style.display = "none";
    document.getElementById("cajero").style.display = "block";
    
    mensaje.textContent = "";

     document.getElementById("titular").textContent = account.owner;
    document.getElementById("numCuenta").textContent = account.accountNumber;   
 
    swal("Acceso concedido", `¡Bienvenido, ${titular}!`, "success");
  } else {
    mensaje.textContent = "PIN incorrecto. Intente nuevamente.";
  }
}


function cerrarSesion() {
  document.getElementById("cajero").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("pin").value = "";
  document.getElementById("mensajeLogin").textContent = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("resultado").textContent = "";
}

function mostrarPantalla(pantalla) {
  document.getElementById("login").style.display = "none";
  document.getElementById("cajero").style.display = "none";
  document.getElementById("historialPantalla").style.display = "none";
  document.getElementById("graficaPantalla").style.display = "none";
  document.getElementById(pantalla).style.display = "block";
}

// --- REDIBUJAR GRÁFICA AL MOSTRAR LA PESTAÑA ---
document.getElementById("grafica-tab").addEventListener("shown.bs.tab", function () {
    if (typeof actualizarGrafica === "function") {
        actualizarGrafica(); // vuelve a dibujar la gráfica
    }
});

