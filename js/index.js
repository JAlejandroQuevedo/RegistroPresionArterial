// DOM
const titulo = document.getElementById('titulo');
const selector = document.getElementById('selector');
const glucosaInputs = document.getElementById('glucosaInputs');
const presionInputs = document.getElementById('presionInputs');
const buttonEntrada = document.getElementById('buttonEntrada');
const buttonMostrar = document.getElementById('buttonMostrar');
const resultadosContainer = document.getElementById('resultados');
const texto = document.getElementById('texto');
const buttonsContainer = document.getElementById('buttons');

// Asignación de las funcionalidades de los botones y selector
selector.addEventListener('change', mostrarInputs);
// Indica si existe algún cambio en el selector, si es así se ejecuta la función mostrarInputs
buttonsContainer.style.display = 'none';
buttonEntrada.addEventListener('click', agregarEntrada);
buttonMostrar.addEventListener('click', mostrarRegistros);
// Se establece que el contenedor de los botones no estará presente hasta que se diga lo contrario

// Declaración de las funciones

// Función que ejecutará los cambios en el HTML según lo elegido en el selector.
function mostrarInputs() {
    if (selector.value === 'glucosa') {
        glucosaInputs.style.display = 'flex';
        presionInputs.style.display = 'none';
        texto.style.display = 'none';
        buttonsContainer.style.display = 'flex';
        glucosaInputs.innerHTML = `
            <label for="glucosa">Glucosa</label>
            <input type="number" id="glucosa" />
        `;
        titulo.innerText = 'Ingresa tu cifra de glucosa';
    } else if (selector.value === 'presion') {
        glucosaInputs.style.display = 'none';
        presionInputs.style.display = 'flex';
        titulo.innerText = 'Ingresa tu cifra de presion arterial';
        texto.style.display = 'none';
        buttonsContainer.style.display = 'flex';
        presionInputs.innerHTML = `
            <label for="diastolica">Presión Arterial Diastólica</label>
            <input type="number" id="diastolica">
            <label for="sistolica">Presión Arterial Sistólica</label>
            <input type="number" id="sistolica">
        `;
    } else {
        glucosaInputs.style.display = 'none';
        presionInputs.style.display = 'none';
        buttonsContainer.style.display = 'none';
        texto.style.display = 'flex';
    }
}

// Función para obtener los valores de los input
function obtenerValorInput(inputId) {
    const input = document.getElementById(inputId);
    return input.value.trim();
    // trim => Elimina los espacios al principio y al final
}

// Función para mostrar la alerta en el HTML
function mostrarAlerta(alerta) {
    const nuevoElemento = document.createElement('p');
    nuevoElemento.innerText = alerta;
    resultadosContainer.appendChild(nuevoElemento);
}

// Función para evaluar los resultados
function evaluarResultado(tipo, cifra1, cifra2) {
    if (tipo === 'glucosa') {
        if (cifra1 <= 70) {
            return 'Baja, consume una fruta';
        } else if (cifra1 >= 70 && cifra1 <= 110) {
            return 'Normal';
        } else {
            return 'Alta, acude al medico';
            
        }
    } else if (tipo === 'presion') {
        if (cifra1 <= 70 && cifra2 <= 120) {
            return 'Baja, reposa y luego acude al medico';
        } else if (cifra1 <= 80 && cifra2 <= 120) {
            return 'Normal';
        } else if (cifra1 >= 90 && cifra2 >= 130) {
            return 'Alta, acude al medico';

        }
    }
}

// Función para llevar el registro y guardarlo en el navegador
function guardarRegistroEnLocalStorage(tipo, fecha, tipoPresion, cifra1, cifra2) {
    let registrosGuardados = JSON.parse(localStorage.getItem('registros')) || [];
    const nuevoRegistro = {
        tipo: tipo,
        fecha: fecha,
        tipoPresion: tipoPresion,
        cifra1: cifra1,
        cifra2: cifra2
    };
    registrosGuardados.push(nuevoRegistro);
    localStorage.setItem('registros', JSON.stringify(registrosGuardados));
}

// Función para agregar la entrada del usuario y mostrar el mensaje
function agregarEntrada() {
    const fechaActual = new Date();
    const fechaHora = fechaActual.toLocaleString();
    const tipo = selector.value;

    if (tipo === 'glucosa' || tipo === 'presion') {
        const cifra1 = obtenerValorInput(tipo === 'glucosa' ? 'glucosa' : 'diastolica');
        const cifra2 = tipo === 'presion' ? obtenerValorInput('sistolica') : '';

        if (cifra1 !== '' && (tipo !== 'presion' || cifra2 !== '')) {
            const resultado = evaluarResultado(tipo, cifra1, cifra2);
            let mensajeUsuario = '';

            if (tipo === 'glucosa') {
                mensajeUsuario = `Tu cifra de glucosa fue: ${cifra1} (${resultado})`;
            } else if (tipo === 'presion') {
                mensajeUsuario = `Tu presión arterial fue: ${cifra1}/${cifra2} (${resultado})`;
            }
            mostrarAlerta(`${mensajeUsuario} (${fechaHora})`);
            guardarRegistroEnLocalStorage(
                tipo,
                fechaHora,
                resultado,
                `Cifra: ${cifra1}`,
                tipo === 'presion' ? `Cifra: ${cifra2}` : ''
            );
        }
    }
}

// Función para mostrar los registros que han sido guardados en el navegador al usuario
function mostrarRegistros() {
    const registrosLocal = JSON.parse(localStorage.getItem('registros')) || [];
    resultadosContainer.innerHTML = '';

    registrosLocal.forEach(registro => {
        let elementoHTML;

        if (registro.tipo === 'glucosa') {
            elementoHTML = document.createElement('div');
            elementoHTML.innerHTML = `<p>Glucosa: ${registro.cifra1} (${registro.fecha})</p>`;
        } else if (registro.tipo === 'presion') {
            const tipoPresion = registro.tipoPresion === 'Baja' ? 'Baja' : 'Alta';
            elementoHTML = document.createElement('div');
            elementoHTML.innerHTML = `<p>Presión Arterial - Diastólica: ${registro.cifra1}, Sistólica: ${registro.cifra2} (${tipoPresion}) (${registro.fecha})</p>`;
        }

        resultadosContainer.appendChild(elementoHTML);
    });
}
