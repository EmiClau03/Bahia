document.getElementById('presupuestoForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Datos del formulario
    const personas = parseInt(document.getElementById('personas').value);
    const cliente = document.getElementById('cliente').value;
    const ciudad = document.getElementById('ciudad').value;
    const kilometros = parseInt(document.getElementById('kilometros').value);
    const fechaEvento = document.getElementById('fechaEvento').value;
    const tipoEvento = document.getElementById('tipoEvento').value;
    const rentabilidad = parseInt(document.getElementById('rentabilidad').value);
    const camioneta = document.getElementById('camioneta').value;

    // Datos de precios y consumo
    const preciosProductos = {
        "Nikov": 4300,
        "Sernova": 5000,
        "Vodka saborizado": 4800,
        "Ron": 12000,
        "Gancia": 4200,
        "Gin": 8400,
        "Aperol": 6300,
        "Licor durazno nac": 4200,
        "Licor de coco": 6000,
        "Fernet Branca": 8000,
        "Wiskey": 7000,
        "Pulpa de frutilla": 4600,
        "Jugo de naranja": 3500,
        "Jugo de anana": 3500,
        "Citric naranja": 2200,
        "7up": 1500,
        "Coca Cola": 1900,
        "Agua tonica": 1800,
        "Granadina": 2300,
        "Azúcar": 1300,
        "Limon cajon": 9000,
        "Hielo molido": 3500,
        "Hielo rolito": 3500,
        "Sorbetes": 4300
    };

    const cantidadPorPersona = {
        "Nikov": 40,
        "Sernova": 35,
        "Vodka saborizado": 312,
        "Ron": 75,
        "Gancia": 93,
        "Gin": 45,
        "Aperol": 131,
        "Licor durazno nac": 102,
        "Licor de coco": 65,
        "Fernet Branca": 25,
        "Wiskey": 500,
        "Pulpa de frutilla": 30,
        "Jugo de naranja": 56,
        "Jugo de anana": 112,
        "Citric naranja": 67,
        "7up": 19,
        "Coca Cola": 13,
        "Agua tonica": 21,
        "Granadina": 450,
        "Azúcar": 41,
        "Limon cajon": 207,
        "Hielo molido": 35,
        "Hielo rolito": 57,
        "Sorbetes": 500
    };

    const combustibleLitro = 1300;
    const consumoCamioneta1 = 8; // km/l
    const consumoCamioneta2 = 6; // km/l
    const pagoHora = 1300;

    const kilometrosIdaVuelta = kilometros * 2; // Considerar ida y vuelta

    let costoTotal = 0;

    // Calcular el costo de productos
    for (let producto in preciosProductos) {
        if (cantidadPorPersona[producto] > 0) {
            let cantidadNecesaria = Math.ceil(personas / cantidadPorPersona[producto]);
            costoTotal += cantidadNecesaria * preciosProductos[producto];
        }
    }

    // Calcular el costo de combustible basado en la selección
    let costoCombustible;
    let detalleCombustible;

    if (camioneta === "1") {
        costoCombustible = (kilometrosIdaVuelta / consumoCamioneta1) * combustibleLitro;
        detalleCombustible = `Gasto de Combustible (1 camioneta): $${costoCombustible.toFixed(2)}`;
    } else if (camioneta === "2") {
        costoCombustible = (kilometrosIdaVuelta / consumoCamioneta2) * combustibleLitro;
        detalleCombustible = `Gasto de Combustible (2 camioneta): $${costoCombustible.toFixed(2)}`;
    } else if (camioneta === "ambas") {
        const gastoCombustibleCamioneta1 = (kilometrosIdaVuelta / consumoCamioneta1) * combustibleLitro;
        const gastoCombustibleCamioneta2 = (kilometrosIdaVuelta / consumoCamioneta2) * combustibleLitro;
        costoCombustible = gastoCombustibleCamioneta1 + gastoCombustibleCamioneta2;
        detalleCombustible = `Gasto de Combustible (ambas camionetas): $${costoCombustible.toFixed(2)}`;
    }

    const gastosProductosYCombustible = costoTotal + costoCombustible;

    // Determinar el número de ayudantes y las horas según el tipo de evento y cantidad de personas
    let horasEncargado, horasAyudante, cantidadAyudantes;

    if (tipoEvento === "gira") {
        horasEncargado = 22;
        horasAyudante = 13;
    } else {
        horasEncargado = 17;
        horasAyudante = 10;
    }

    if (personas >= 300) {
        cantidadAyudantes = 4;
    } else if (personas >= 250) {
        cantidadAyudantes = 3;
    } else if (personas >= 200) {
        cantidadAyudantes = 2;
    } else if (personas >= 150) {
        cantidadAyudantes = 2;
    } else if (personas >= 100) {
        cantidadAyudantes = 1;
    } else {
        cantidadAyudantes = 1;
    }

    const costoPersonal = (horasEncargado + horasAyudante * cantidadAyudantes) * pagoHora;
    const gastos = gastosProductosYCombustible + costoPersonal;

    // Aplicar rentabilidad
    let multiplicador;
    switch (rentabilidad) {
        case 60:
            multiplicador = 2.5;
            break;
        case 66:
            multiplicador = 3;
            break;
        case 71:
            multiplicador = 3.5;
            break;
        default:
            multiplicador = 1;
    }

    const costoFinal = gastos * multiplicador;
    const costoPorPersona = costoFinal / personas;
    const gananciaBruta = costoPorPersona * personas;
    const gananciaNeta = gananciaBruta - gastos;

    // Mostrar el botón para descargar el flyer
    const botonDescargarp = document.getElementById('descargarPresupuesto');
const botonDescargarf = document.getElementById('descargarFlyer');

// Mostrar ambos botones
botonDescargarp.style.display = 'block';
botonDescargarf.style.display = 'block';

// Evento para el botón de descargar presupuesto
botonDescargarp.addEventListener('click', function() {
    // Cargar la plantilla HTML
    fetch('pdf-template.html')
        .then(response => response.text())
        .then(template => {
            // Obtener la fecha actual
            const fechaActual = new Date();
            const dia = fechaActual.getDate().toString().padStart(2, '0');
            const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
            const año = fechaActual.getFullYear();
            const fechaEmitida = `${dia}/${mes}/${año}`;

            // Reemplazar la fecha en la plantilla
            const pdfContent = template
                .replace(/<p id="fechaEmitida">Fecha emitida:<\/p>/, `<p>Fecha emitida: ${fechaEmitida}</p>`)
                .replace('<p id="cliente"></p>', `<p>${cliente}</p>`)
                .replace('<p id="ciudad"></p>', `<p>${ciudad}</p>`)
                .replace('<p id="fechaEvento"></p>', `<p>${fechaEvento}</p>`)
                .replace('<p id="personas"></p>', `<p>${personas}</p>`)
                .replace('<p id="tipoEvento"></p>', `<p>${tipoEvento}</p>`)
                .replace('<p id="rentabilidad"></p>', `<p>${rentabilidad}%</p>`)
                .replace('<p id="costoFinal"></p>', `<p>$${costoFinal.toFixed(2)}</p>`)
                .replace('<p id="costoPorPersona"></p>', `<p>$${costoPorPersona.toFixed(2)}</p>`)
                .replace('<p id="gananciaBruta"></p>', `<p>$${gananciaBruta.toFixed(2)}</p>`)
                .replace('<p id="gastosInsumos"></p>', `<p>$${costoTotal.toFixed(2)}</p>`)
                .replace('<p id="sueldosTotales"></p>', `<p>$${costoPersonal.toFixed(2)}</p>`)
                .replace('<p id="gastos"></p>', `<p>$${gastos.toFixed(2)}</p>`)
                .replace('<p id="gananciaNeta"></p>', `<p>$${gananciaNeta.toFixed(2)}</p>`);

            // Convertir el contenido HTML a PDF
            html2pdf().from(pdfContent).set({
                margin: 0,
                filename: `Presupuesto_${cliente.replace(/\s+/g, '_')}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).save();
        });
});

// Evento para el botón de descargar flyer

// Evento para el botón de descargar flyer
botonDescargarf.addEventListener('click', function() {
    fetch('flyer.html')
        .then(response => response.text())
        .then(template => {
            // Obtener la fecha actual
            const fechaEmitida = new Date().toLocaleDateString('es-ES');

            // Reemplazar los datos en el template
            const pdfContent = template
                .replace(/<p id="cliente">.*<\/p>/, `<p id="cliente">${cliente}</p>`)
                .replace(/<p id="ciudad">.*<\/p>/, `<p id="ciudad">${ciudad}</p>`)
                .replace(/<p id="fechaEvento">.*<\/p>/, `<p id="fechaEvento">${fechaEvento}</p>`)
                .replace(/<p id="personas">.*<\/p>/, `<p id="personas">${personas}</p>`)
                .replace(/<p id="fechaEmitida">.*<\/p>/, `<p id="fechaEmitida">${fechaEmitida}</p>`)
                .replace(/<p id="costoFinalFlyer">.*<\/p>/, `<p id="costoFinalFlyer">${costoFinal.toFixed(2)}</p>`);  // Aquí se agrega el costo final

            // Convertir el contenido HTML a PDF
            html2pdf().from(pdfContent).set({
                margin: 0,
                filename: `Flyer_${cliente.replace(/\s+/g, '_')}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 1 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).save();
        }); 
    });
});