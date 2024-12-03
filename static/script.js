const analyzeBtn = document.getElementById('analyzeBtn');
const audioFileInput = document.getElementById('audioFile');
const resultsTable = document.getElementById('resultsTable');
const resultsBody = resultsTable.querySelector('tbody');
const resultMessage = document.getElementById('resultMessage');
const executionTimeDiv = document.getElementById('executionTime');
const timeValue = document.getElementById('timeValue');
const levelSelect = document.getElementById('levelSelect');
const levelSubOptions = document.getElementById('levelSubOptions');
const subOptions = document.getElementById('subOptions');
let selectedFile = null;
const fileNameDisplay = document.getElementById('fileName');

// Función para mostrar subcategorías según el nivel seleccionado
levelSelect.addEventListener('change', () => {
    const selectedLevel = levelSelect.value;
    levelSubOptions.innerHTML = ''; // Limpiar las subcategorías anteriores
    subOptions.innerHTML = ''; // Limpiar las opciones específicas anteriores

    if (selectedLevel === '1') {
        levelSubOptions.innerHTML = `
            <label for="level1SubSelect">Selecciona la subcategoría:</label>
            <select id="level1SubSelect">
                <option value="vocales">Vocales</option>
                <option value="abecedario">Abecedario</option>
                <option value="silabas">Sílabas</option>
            </select>
        `;

        document.getElementById('level1SubSelect').addEventListener('change', () => {
            const selectedSubOption = document.getElementById('level1SubSelect').value;
            subOptions.innerHTML = ''; // Limpiar las opciones anteriores

            if (selectedSubOption === 'vocales') {
                subOptions.innerHTML = `
                    <label for="vocalesSelect">Selecciona una vocal:</label>
                    <select id="vocalesSelect">
                        <option value="a">A</option>
                        <option value="e">E</option>
                        <option value="i">I</option>
                        <option value="o">O</option>
                        <option value="u">U</option>
                    </select>
                `;
            } else if (selectedSubOption === 'abecedario') {
                subOptions.innerHTML = `
                    <label for="abecedarioSelect">Selecciona una letra:</label>
                    <select id="abecedarioSelect">
                        <option value="a">A</option>
                        <option value="b">B</option>
                        <option value="c">C</option>
                        <option value="d">D</option>
                        <option value="e">E</option>
                        <!-- Añade más letras del abecedario aquí -->
                    </select>
                `;
            } else if (selectedSubOption === 'silabas') {
                subOptions.innerHTML = `
                    <label for="silabasSelect">Selecciona una sílaba:</label>
                    <select id="silabasSelect">
                        <option value="ma">MA</option>
                        <option value="me">ME</option>
                        <option value="mi">MI</option>
                        <option value="mo">MO</option>
                        <option value="mu">MU</option>
                        <!-- Añade más sílabas aquí -->
                    </select>
                `;
            }
        });

        document.getElementById('level1SubSelect').dispatchEvent(new Event('change'));

    } else if (selectedLevel === '2') {
        levelSubOptions.innerHTML = `
            <label for="level2SubSelect">Selecciona la subcategoría:</label>
            <select id="level2SubSelect">
                <option value="colores">Colores</option>
                <option value="formas">Formas</option>
                <option value="numeros">Números</option>
            </select>
        `;

        document.getElementById('level2SubSelect').addEventListener('change', () => {
            const selectedSubOption = document.getElementById('level2SubSelect').value;
            subOptions.innerHTML = ''; // Limpiar las opciones anteriores

            if (selectedSubOption === 'colores') {
                subOptions.innerHTML = `
                    <label for="coloresSelect">Selecciona un color:</label>
                    <select id="coloresSelect">
                        <option value="rojo">Rojo</option>
                        <option value="azul">Azul</option>
                        <option value="verde">Verde</option>
                        <option value="amarillo">Amarillo</option>
                        <option value="naranja">Naranja</option>
                        <!-- Añade más colores aquí -->
                    </select>
                `;
            } else if (selectedSubOption === 'formas') {
                subOptions.innerHTML = `
                    <label for="formasSelect">Selecciona una forma:</label>
                    <select id="formasSelect">
                        <option value="circulo">Círculo</option>
                        <option value="cuadrado">Cuadrado</option>
                        <option value="triangulo">Triángulo</option>
                        <option value="rectangulo">Rectángulo</option>
                        <!-- Añade más formas aquí -->
                    </select>
                `;
            } else if (selectedSubOption === 'numeros') {
                subOptions.innerHTML = `
                    <label for="numerosSelect">Selecciona un número:</label>
                    <select id="numerosSelect">
                        <option value="uno">Uno</option>
                        <option value="dos">Dos</option>
                        <option value="tres">Tres</option>
                        <option value="cuatro">Cuatro</option>
                        <option value="cinco">Cinco</option>
                        <!-- Añade más números aquí -->
                    </select>
                `;
            }
        });

        document.getElementById('level2SubSelect').dispatchEvent(new Event('change'));
    }else if(selectedLevel === '3') {
        levelSubOptions.innerHTML = `
            <label for="level3SubSelect">Selecciona la subcategoría:</label>
            <select id="level3SubSelect">
                <option value="animales">Animales</option>
                <option value="comida">Comida</option>
                <option value="cuerpoHumano">Cuerpo Humano</option>
                <option value="emociones">Emociones</option>
                <option value="familia">Familia</option>
            </select>
        `;
        document.getElementById('level3SubSelect').addEventListener('change', () => {
            const selectedSubOption = document.getElementById('level3SubSelect').value;
            subOptions.innerHTML = ''; // Limpiar las opciones anteriores

            if (selectedSubOption === 'animales') {
                subOptions.innerHTML = `
                    <label for="animalesSelect">Selecciona un animal:</label>
                    <select id="animalesSelect">
                        <option value="ardilla">Ardilla</option>
                        <option value="buho">Búho</option>
                        <option value="ciervo">Ciervo</option>
                        <option value="lobo">Lobo</option>
                        <option value="zorro">Zorro</option>
                        <option value="serpiente">Serpiente</option>
                        <!-- Añade más colores aquí -->
                    </select>
                `;
            }else if (selectedSubOption === 'comida'){
                subOptions.innerHTML = `
                    <label for="comidaSelect">Selecciona la comida:</label>
                    <select id="comidaSelect">
                        <option value="fresa">Fresa</option>
                        <option value="buho">Búho</option>
                        <option value="ciervo">Ciervo</option>
                        <option value="lobo">Lobo</option>
                        <option value="zorro">Zorro</option>
                        <option value="serpiente">Serpiente</option>
                        <!-- Añade más colores aquí -->
                    </select>
                `;
            }else if(selectedSubOption === 'cuerpoHumano'){
                subOptions.innerHTML = `
                    <label for="cuerpoHumanoSelect">Selecciona una parte del cuerpo humano:</label>
                    <select id="cuerpoHumanoSelect">
                        <option value="boca">Boca</option>
                        <option value="frente">Frente</option>
                        <option value="nariz">Nariz</option>
                        <option value="ojos">Ojos</option>
                        <option value="orejas">Orejas</option>
                        <!-- Añade más colores aquí -->
                    </select>
                `;
            }else if (selectedSubOption === 'emociones'){
                subOptions.innerHTML = `
                    <label for="emocionesSelect">Selecciona una emoción:</label>
                    <select id="emocionesSelect">
                        <option value="amor">Amor</option>
                        <option value="asco">Asco</option>
                        <option value="enojo">Enojo</option>
                        <option value="envidia">Envidia</option>
                        <option value="felicidad">Felicidad</option>
                        <!-- Añade más colores aquí -->
                    </select>
                `;
            }else if(selectedSubOption === 'familia'){
                subOptions.innerHTML = `
                    <label for="familiaSelect">Selecciona un familiar:</label>
                    <select id="familiaSelect">
                        <option value="abuela">Abuela</option>
                        <option value="abuelo">Abuelo</option>
                        <option value="hermana">Hermana</option>
                        <option value="hermano">Hermano</option>
                        <option value="mama">Mamá</option>
                        <!-- Añade más colores aquí -->
                    </select>
                `;
            }
        });
        document.getElementById('level3SubSelect').dispatchEvent(new Event('change'));
    }
});

// Inicializar las subcategorías cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    levelSelect.dispatchEvent(new Event('change'));
});

audioFileInput.addEventListener('change', (event) => {
    selectedFile = event.target.files[0];
    fileNameDisplay.textContent = selectedFile.name; // Mostrar el nombre del archivo
});

analyzeBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        alert('Primero selecciona un archivo de audio.');
        return;
    }

    const formData = new FormData();
    formData.append('audio', selectedFile);
    
    // Obtener y enviar la opción seleccionada según el nivel y la subcategoría
    const selectedLevel = levelSelect.value;
    let selectedOption = '';
    if (selectedLevel === '1') {
        const subSelect = document.getElementById('level1SubSelect').value;
        if (subSelect === 'vocales') {
            selectedOption = document.getElementById('vocalesSelect').value;
        } else if (subSelect === 'abecedario') {
            selectedOption = document.getElementById('abecedarioSelect').value;
        } else if (subSelect === 'silabas') {
            selectedOption = document.getElementById('silabasSelect').value;
        }
    } else if (selectedLevel === '2') {
        const subSelect = document.getElementById('level2SubSelect').value;
        if (subSelect === 'colores') {
            selectedOption = document.getElementById('coloresSelect').value;
        } else if (subSelect === 'formas') {
            selectedOption = document.getElementById('formasSelect').value;
        } else if (subSelect === 'numeros') {
            selectedOption = document.getElementById('numerosSelect').value;
        }
    } else if (selectedLevel === '3') {
        const subSelect = document.getElementById('level3SubSelect').value;
        if(subSelect === 'animales'){
            selectedOption = document.getElementById('animalesSelect').value;
        }else if(subSelect === 'comida'){
            selectedOption = document.getElementById('comidaSelect').value;
        }else if(subSelect === 'cuerpoHumano'){
            selectedOption = document.getElementById('cuerpoHumanoSelect').value;
        }else if(subSelect === 'emociones'){
            selectedOption = document.getElementById('emocionesSelect').value;
        }else if(subSelect === 'familia'){
            selectedOption = document.getElementById('familiaSelect').value;
        }
    }
    
    formData.append('option', selectedOption); // Enviar la opción seleccionada al backend

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Error al analizar el archivo.');

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error:', error);
        resultMessage.textContent = 'Hubo un problema al analizar el audio.'; // Mensaje de error
    }
});

// Función para mostrar los resultados en la tabla
function displayResults(data) {
    resultsBody.innerHTML = '';

    // Crear una nueva fila con los datos de análisis
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.filename}</td>
        <td>${data.jitter.toFixed(4)}</td>
        <td>${data.shimmer.toFixed(4)}</td>
        <td>${data.meanF0Hz.toFixed(2)} Hz</td>
        <td>${data.executionTime.toFixed(5)} s</td>
        <td>${data.probability.toFixed(2)}%</td>
        <td>${data.validation}</td>
        <td>${data.falsePositives || 'N/A'}</td>
        <td>${data.falseNegatives || 'N/A'}</td>
    `;
    
    // Agregar la nueva fila a la tabla
    resultsBody.appendChild(row);

    
timeValue.textContent = `${data.executionTime.toFixed(5)} segundos`;
executionTimeDiv.style.display = 'block';

// Mostrar mensaje de éxito
resultMessage.textContent = 'Análisis completado exitosamente.'; // Mensaje de éxito
}