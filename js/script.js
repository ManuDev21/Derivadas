$(document).ready(function () {
    $("#tipoCalculo").change(function () {
        if ($(this).val() === "limite") {
            $("#limiteInput").fadeIn(300);
        } else {
            $("#limiteInput").fadeOut(300);
        }
    });

    $("#calcular").click(function () {
        let funcion = $("#funcion").val();
        let tipo = $("#tipoCalculo").val();
        let resultado = "";
        let dominio = calcularDominio(funcion);
        let rango = calcularRango(funcion, dominio);
        let simplificada = math.simplify(funcion).toString();
        let graficaX = math.range(-10, 10, 0.1).toArray();
        let graficaY = graficaX.map(x => math.evaluate(funcion, { x }));

        try {
            if (tipo === "derivada") {
                resultado = math.derivative(funcion, "x").toString();
                mostrarResultado(funcion, simplificada, resultado, dominio, rango);
            } else if (tipo === "limite") {
                let valorL = parseFloat($("#valorLimite").val());
                if (isNaN(valorL)) {
                    Swal.fire("Error", "Debe ingresar un valor para el límite", "error");
                    return;
                }
                let limite = math.evaluate(funcion, { x: valorL });
                resultado = `Límite en x = ${valorL}: ${limite}`;

                mostrarResultado(funcion, simplificada, resultado, dominio, rango, valorL);
            }

            // Graficar función
            Plotly.newPlot("grafica", [{
                x: graficaX,
                y: graficaY,
                type: "scatter",
                mode: "lines",
                name: "f(x)"
            }]);

        } catch (error) {
            Swal.fire("Error", "Función inválida", "error");
        }
    });

    function mostrarResultado(funcion, simplificada, resultado, dominio, rango, valorL = null) {
        Swal.fire({
            title: "Resultado",
            html: `<b>Función Original:</b> ${funcion}<br>
                   <b>Función Simplificada:</b> ${simplificada}<br>
                   <b>Resultado:</b> ${resultado}<br>
                   <b>Dominio:</b> ${dominio}<br>
                   <b>Rango:</b> ${rango}`,
            icon: "success"
        }).then(() => {
            if (valorL !== null) {
                mostrarLimitesLaterales(funcion, valorL);
            }
        });
    }

    function mostrarLimitesLaterales(funcion, valorL) {
        let izquierda = [];
        let derecha = [];
        for (let i = 1; i <= 5; i++) {
            let xIzq = valorL - (0.1 * i);
            let xDer = valorL + (0.1 * i);
            izquierda.push(`f(${xIzq.toFixed(2)}) = ${math.evaluate(funcion, { x: xIzq }).toFixed(4)}`);
            derecha.push(`f(${xDer.toFixed(2)}) = ${math.evaluate(funcion, { x: xDer }).toFixed(4)}`);
        }

        Swal.fire({
            title: "Límites Laterales",
            html: `<b>Valores hacia la izquierda:</b><br>${izquierda.join("<br>")}<br><br>
                   <b>Valores hacia la derecha:</b><br>${derecha.join("<br>")}`,
            icon: "info"
        });
    }

    function calcularDominio(funcion) {
        if (funcion.includes('/x')) {
            return "Todos los reales excepto x = 0";
        }
        if (funcion.includes('sqrt(x)')) {
            return "[0, ∞)";
        }
        return "(-∞, ∞)";
    }

    function calcularRango(funcion, dominio) {
        let valoresY = [];
        let xValores = math.range(-10, 10, 0.1).toArray();
        xValores.forEach(x => {
            try {
                valoresY.push(math.evaluate(funcion, { x }));
            } catch (e) {}
        });
        return `[${Math.min(...valoresY).toFixed(2)}, ${Math.max(...valoresY).toFixed(2)}]`;
    }
});

