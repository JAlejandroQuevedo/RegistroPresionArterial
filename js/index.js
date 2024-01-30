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
const buttonLimpiarRegistro = document.getElementById('limpiarLocal');
const clean = document.getElementById('clean');

//Se desaparecen los botones del html
buttonsContainer.style.display = 'none';

// Asignación de las funcionalidades de los botones y selector con sus correspondientes funciones
selector.addEventListener('change', () => {
    // Función que ejecutará los cambios en el HTML según lo elegido en el selector.
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
        titulo.innerText = 'Ingresa tu cifra de presión arterial';
        texto.style.display = 'none';
        buttonsContainer.style.display = 'flex';
        presionInputs.innerHTML = `
            <label for="diastolica">Presión Arterial Diastólica</label>
            <input type="number" id="diastolica">
            <label for="sistolica">Presión Arterial Sistólica</label>
            <input type="number" id="sistolica">
        `;
    } else {
        location.reload();
    }
});
buttonEntrada.addEventListener('click', () => {
    const fechaActual = new Date();
    const fechaHora = fechaActual.toLocaleString();
    const tipo = selector.value;
    Toastify({
        text:"Cifra agregada con exito",
        duration:2000,
        position:"right",
        gravity:"top",
        style:{
            background:"#E89302",
            color: "black",
            "border-radius": "10px",
            "font-family": "'PT Sans', sans-serif",
            "box-shadow": "none",
        }

    }).showToast()
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
            if (tipo === 'glucosa') {
                if (cifra1 <= 70) {
                    resultadosContainer.style = `
                    background-color: #FA990F;  
                    `;
                } else if (cifra1 >= 70 && cifra1 <= 110) {
                    resultadosContainer.style = `
                    background-color: #2EB70F;
                    `;
                } else {
                    resultadosContainer.style = `
                    background-color: #F52F0C;
                    `;
                }
            } else if (tipo === 'presion') {
                if (cifra1 <= 70 && cifra2 <= 100) {
                    resultadosContainer.style = `
                    background-color: #FA990F;  
                    `
                } else if (cifra1 <= 80 && cifra2 <= 120) {
                    resultadosContainer.style = `
                    background-color: #2EB70F;  
                    `
                } else if (cifra1 >= 90 && cifra2 >= 130) {
                    resultadosContainer.style = `
                    background-color: #F52F0C;
                    `;
                }
        }
    }
}});

buttonMostrar.addEventListener('click', () => {
    Toastify({
        text:"Mostrando registro",
        duration:2000,
        position:"right",
        gravity:"top",
        style:{
            background:"#3FF2BB",
            color: "black",
            "border-radius": "10px",
            "font-family": "'PT Sans', sans-serif",
            "box-shadow": "none",
        }

    }).showToast()
    const registrosLocal = JSON.parse(localStorage.getItem('registros')) || [];
    resultadosContainer.innerHTML = '';
    resultadosContainer.style = `{
        background-color: #3FF2BB;
    }`
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
});

buttonLimpiarRegistro.addEventListener('click', () => {
    //Funcion que limpiara los registros del local storage.
    resultadosContainer.innerHTML = '';
    localStorage.removeItem('registros');
    resultadosContainer.style = `{
        background-color: var(--back-div-form);
    }`
    Toastify({
        text:"Registro limpiado con éxito",
        duration:2000,
        position:"right",
        gravity:"top",
        style:{
            background:"#F5271D",
            color: "white",
            "border-radius": "10px",
            "font-family": "'PT Sans', sans-serif",
            "box-shadow": "none",
        }

    }).showToast()
});

//Declaracion de funciones fuera de los botones con eventos

// Función para obtener los valores de los input
function obtenerValorInput(inputId) {
    const input = document.getElementById(inputId);
    return input.value.trim();
}

// Función para mostrar la alerta en el HTML
function mostrarAlerta(alerta) {
    const nuevoElemento = document.createElement('p');
    nuevoElemento.innerText = alerta;
    resultadosContainer.appendChild(nuevoElemento);
}

function evaluarResultado(tipo, cifra1, cifra2) {
    if (tipo === 'glucosa') {
        if (cifra1 <= 70) {
            return 'Es algo baja, consume una fruta';
        } else if (cifra1 >= 70 && cifra1 <= 110) {
            return 'Es normal, ¡Sigue así!';
        } else {
            return 'Esta demasiado alta, ¡acude al médico!';
        }
    } else if (tipo === 'presion') {
        if (cifra1 <= 70 && cifra2 <= 120) {
            return 'Baja, reposa y luego acude al médico';
        } else if (cifra1 <= 80 && cifra2 <= 120) {
            return 'Es normal, ¡Sigue así!';
        } else if (cifra1 >= 90 && cifra2 >= 130) {
            return 'Esta demasiado alta, ¡acude al médico!';
        }
    }
}

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

clean.addEventListener('click', ()=>{
    location.reload()
}) 

//Nota inicio con dinamnismo asincronico

const mensajeNota = 'Nota: Si tu parametro de salud es anormal, se te alertará';

let indice = 0

const mostrarLetra = ()=>{
    texto.textContent += mensajeNota[indice];
    indice++;

    if(indice < mensajeNota.length){
        setTimeout(mostrarLetra, 50)
    }
}

setTimeout(mostrarLetra,50);