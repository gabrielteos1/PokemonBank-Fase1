function verHistorial() {
  const contenedorPrincipal = document.getElementById("historialGraficaContainer");
  const contenedorHistorial = document.getElementById("historial");
  const grafica = document.getElementById("graficaHistorial");
  const btnDescargar = document.getElementById("btnDescargarGrafica");

  //  Si el contenedor está visible, lo ocultamos (toggle)
  if (contenedorPrincipal.style.display === "block") {
    contenedorPrincipal.style.display = "none";
    grafica.style.display = "none";
    btnDescargar.style.display = "none";
    return;
  }

  //  Si no está visible, lo mostramos
  contenedorPrincipal.style.display = "block";
  btnDescargar.style.display = "inline-block";

  //  Generar contenido del historial
  if (!historial || historial.length === 0) {
    contenedorHistorial.innerHTML = "<p>No hay transacciones registradas.</p>";
  } else {
    let contenido = "<h5>📜 Historial de transacciones</h5><ul>";
    historial.forEach(t => {
      contenido += `<li>${t.fecha} — <b>${t.tipo}</b>: $${t.monto.toFixed(2)}</li>`;
    });
    contenido += "</ul>";
    contenedorHistorial.innerHTML = contenido;
  }

  //  Generar gráfica
  console.log("Historial actual:", historial);
  actualizarGrafica();
}



let grafica = null;

function actualizarGrafica() {
  const canvas = document.getElementById("graficaHistorial");
  if (!canvas) return; // evitar error si no está en el DOM
  const ctx = canvas.getContext("2d");

  if (grafica) grafica.destroy();

  const tipos = {};
  historial.forEach(mov => {
    if (!tipos[mov.tipo]) tipos[mov.tipo] = 0;
    tipos[mov.tipo] += mov.monto;
  });

  const etiquetas = Object.keys(tipos);
  const datos = Object.values(tipos);

  if (etiquetas.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  grafica = new Chart(ctx, {
    type: "bar",
    data: {
      labels: etiquetas,
      datasets: [{
        label: "Monto ($)",
        data: datos,
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)"
        ],
        borderColor: "rgba(0,0,0,0.3)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Resumen de Transacciones" }
      },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function descargarHistorialPDF() {
  if (!historial || historial.length === 0) {
    swal("Sin datos", "No hay transacciones para exportar.", "info");
    return;
  }

  const { jsPDF } = window.jspdf; // acceder a jsPDF desde UMD
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margenX = 40;
  let y = 40;

  doc.setFontSize(14);
  doc.text("Historial de Transacciones", margenX, y);
  y += 20;
  doc.setFontSize(10);
  doc.text(`Titular: ${cuenta.titular}`, margenX, y);
  y += 20;
  doc.text(`Generado: ${new Date().toLocaleString()}`, margenX, y);
  y += 25;

  // Encabezado de la tabla
  doc.setFontSize(11);
  doc.text("Fecha", margenX, y);
  doc.text("Tipo", margenX + 180, y);
  doc.text("Monto ($)", margenX + 360, y);
  y += 12;
  doc.setLineWidth(0.5);
  doc.line(margenX, y, 560, y);
  y += 12;

  historial.forEach((mov, index) => {
    const fecha = mov.fecha;
    const tipo = mov.tipo;
    const monto = mov.monto.toFixed(2);
    // si se acerca al final de la página, crear nueva página
    if (y > 750) {
      doc.addPage();
      y = 40;
    }
    doc.text(fecha.toString(), margenX, y);
    doc.text(tipo.toString(), margenX + 180, y);
    doc.text(monto.toString(), margenX + 360, y);
    y += 16;
  });

  // Guardar el PDF
  doc.save(`historial_${cuenta.titular.replace(/\s+/g, "_")}.pdf`);
}

function descargarGraficaPDF() {
  // Asegúrate de que la librería jsPDF esté disponible
  const { jsPDF } = window.jspdf;

  // Obtenemos el canvas de la gráfica
  const canvas = document.getElementById("graficaHistorial");
  const imgData = canvas.toDataURL("image/png", 1.0); // convertimos la gráfica a imagen

  // Creamos un nuevo PDF
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [600, 400]
  });

  // Agregamos título
  pdf.setFontSize(18);
  pdf.text("Gráfica de Transacciones - Pokémon Bank", 40, 40);

  // Insertamos la imagen de la gráfica
  pdf.addImage(imgData, "PNG", 50, 60, 500, 300);

  // Guardamos el PDF
  pdf.save("Grafica_Transacciones_PokemonBank.pdf");
}

