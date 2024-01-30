document.addEventListener("DOMContentLoaded",()=>{
    const charactersContainer = document.getElementById("characters-container");


    const apiUrl = "https://dragonball-api.com/api/characters?gender=Male";

    fetch(apiUrl)
       .then(response => {
        if (!response.ok){
            throw new Error('la solicitud no fue exitosa')
        }
        return response.json()
       })
        .then(characters =>{
            renderCharacters(characters)
        })
        .cath(error =>{
            console.log("error al obtener los personajes", error)
        })
    
    function renderCharacters(characters){
        characters.forEach(character => {
            const characterElement = document.createElement("div")
            characterElement.innerHTML =`
                <h2 >${character.name}</h2>
                <img src="${character.image}" alt="${character.name}">
                <p>Raza: ${character.race}</p>
                <p>Ki: ${character.ki}</p>
                <p>Descripcion: ${character.description}</p>
            
            `;
            charactersContainer.appendChild(characterElement);
        });


    }

    })
