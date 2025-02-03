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
            } else if (tipo === "limite") {
                let valorL = parseFloat($("#valorLimite").val());
                if (isNaN(valorL)) {
                    Swal.fire("Error", "Debe ingresar un valor para el límite", "error");
                    return;
                }
                let limite = math.lim(math.parse(funcion), 'x', valorL);
                resultado = `Límite: ${limite}`;
            }

            Swal.fire({
                title: "Resultado",
                html: `<b>Función Original:</b> ${funcion}<br>
                       <b>Función Simplificada:</b> ${simplificada}<br>
                       <b>Resultado:</b> ${resultado}<br>
                       <b>Dominio:</b> ${dominio}<br>
                       <b>Rango:</b> ${rango}`,
                icon: "success"
            });

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
