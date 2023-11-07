document.addEventListener("DOMContentLoaded", function () {
    const loadingContainer = document.querySelector(".loading-container");
    const loadingProgress = document.getElementById("loading-progress");


    const cargaTotal = 100;
    const intervalo = 50; 
    let progreso = 0;

    document.body.style.overflow = 'hidden'

    const actualizarPorcentaje = () => {
        progreso++;
        loadingProgress.textContent = progreso ;
    };

    const cargarContenidoPrincipal = () => {
        setTimeout(() => {
            loadingContainer.style.display = "none"; 
            document.body.style.overflow = 'auto';
        }, 5000); 

        const intervaloCarga = setInterval(() => {
            if (progreso < cargaTotal) {
                actualizarPorcentaje();
            } else {
                clearInterval(intervaloCarga);
            }
        }, intervalo);
    };

    cargarContenidoPrincipal(); 
});