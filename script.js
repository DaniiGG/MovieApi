window.onload = function () {

const inputBusqueda = document.getElementById('search-input');
    const resultadosBusqueda = document.getElementById('search-results');
    const paginaDetalle = document.getElementById('detail-page');
    const graficas = document.getElementById('graficas');
    const poster = document.getElementById('poster');
    const titulo = document.getElementById('title');
    const director = document.getElementById('director');
    const actores = document.getElementById('actors');
    const genero = document.getElementById('genero');
    const tiempo = document.getElementById('tiempo');
    const argumento = document.getElementById('plot');
    const ano = document.getElementById('year');
    const salida = document.getElementById('release');
    const dinero = document.getElementById('boxoffice');
    const calificaciones = document.getElementById('ratings');
    const botonVolver = document.getElementById('back-button');
    const botonVolver2 = document.getElementById('back-button2');

    const loader = document.getElementById('loader-container');
    const loader2 = document.getElementById('loader-container2');
    const loader3 = document.getElementById('loader-container3');
    const loader4 = document.getElementById('loader-container4');
    
  const informe = document.getElementById('informe');
  const eleccion = document.getElementById("eleccion");
  const portada = document.getElementById("portada");


  const peliculas = [];

  let type='&type=movie';
  eleccion.addEventListener('change', function() {
  const seleccion = this.value;
  
  if (seleccion === 'peliculas') {
    type='&type=movie';
  } else if (seleccion === 'series') {
     type='&type=series'
  } 
  });

  

  

  


let timeoutId = null;
    // Función para buscar películas o series
    const buscarPeliculas = () => {
  const terminoBusqueda = inputBusqueda.value;
  peliculas.splice(0,peliculas.length);
  
  clearTimeout(timeoutId);

  if (terminoBusqueda.length >= 3) {

    portada.style.display="none";
    loader.style.display="block";
    informe.style.display = 'block';
    timeoutId = setTimeout(function() {
        
    
    fetch("https://www.omdbapi.com/?apikey=9fce6812"+type+"&s=" + terminoBusqueda)
    
      .then(response => response.json())//nueva promesa
      .then(data => {
        
        resultadosBusqueda.innerHTML = '';

        if(data.Search)
            data.Search.forEach(pelicula => {
              const elementoPelicula = document.createElement('div');
              const imagenURL = pelicula.Poster === 'N/A' ? 'img/default.jpg' : pelicula.Poster;

              const posterImagen = new Image();
              posterImagen.onerror = () => {
                elementoPelicula.innerHTML = "<img src='img/default.jpg'><h3>"+pelicula.Title+"</h3><p>Año:"+pelicula.Year+"</p><p>Imagen no disponible</p>";
              };
              posterImagen.src = imagenURL;

              if (pelicula.Poster === 'N/A') {
                elementoPelicula.innerHTML = "<img src='img/default.jpg'><h3>"+pelicula.Title+"</h3><p>Año: "+pelicula.Year+"</p>";
              } else {
                elementoPelicula.appendChild(posterImagen);
                elementoPelicula.innerHTML += "<h3>"+pelicula.Title+"</h3><p>Año: "+pelicula.Year+"</p>";
                peliculas.push(pelicula.imdbID); // Aquí se añade la imagen al array
              }

              elementoPelicula.addEventListener('click', () => mostrarDetallePelicula(pelicula.imdbID));
              resultadosBusqueda.appendChild(elementoPelicula);
            });

            loader.style.display = "none";
          })
          .catch(error => {
            console.error('Error al obtener los resultados de búsqueda:', error);
          });
        }, 1000);
  }
};

    // Carga con scroll
    let paginaActual = 1;
    let cargando = false;

    function cargarMasPeliculas() {
      const alturaPagina = document.documentElement.scrollHeight;
      const scrollSuperior = document.documentElement.scrollTop;
      const alturaCliente = document.documentElement.clientHeight;
      
      if (scrollSuperior + alturaCliente >= alturaPagina - 100 && !cargando && portada.style.display=="none") {
        cargando = true;
        paginaActual++;
        loader2.style.display="block";
        const terminoBusqueda = inputBusqueda.value;
  
        fetch("https://www.omdbapi.com/?apikey=9fce6812"+type+"&s=" + terminoBusqueda + "&page=" + paginaActual)
          .then(response => response.json())
          .then(data => {
            cargando = false;
            if(data.Search)
              data.Search.forEach(pelicula => {
                const elementoPelicula = document.createElement('div');
                if(pelicula.Poster == 'N/A'){
                  elementoPelicula.innerHTML = "<img src=img/default.jpg><h3>" + pelicula.Title + "</h3><p>Año: " + pelicula.Year + "</p>";
                }else{
                elementoPelicula.innerHTML = "<img src=" + pelicula.Poster + "><h3>" + pelicula.Title + "</h3><p>Año: " + pelicula.Year + "</p>";
                peliculas.push(pelicula.imdbID); // Aquí se añade la imagen al array
              }
              loader2.style.display="none";
                elementoPelicula.addEventListener('click', () => mostrarDetallePelicula(pelicula.imdbID));
                resultadosBusqueda.appendChild(elementoPelicula);
                
              });
            })
          .catch(error => {
            cargando = false;
            console.error('Error al cargar más resultados:', error);
          });
      }
    }




    //Detalles de una película
    const mostrarDetallePelicula = (imdbID) => {
      loader3.style.display="block";
      paginaDetalle.style.display = 'flex';

      fetch("https://www.omdbapi.com/?apikey=9fce6812&i=" + imdbID)
        .then(response => response.json())
        .then(pelicula => {
          poster.src = pelicula.Poster !== 'N/A' ? pelicula.Poster : 'img/default.jpg';
          titulo.innerText = pelicula.Title;
          director.innerText = "Director: " + pelicula.Director;
          actores.innerText = "Actores: " + pelicula.Actors;
          genero.innerText = "Género: " + pelicula.Genre;
          tiempo.innerText = "Tiempo: " + pelicula.Runtime;
          argumento.innerText = "Sinopsis: " + pelicula.Plot;
          ano.innerText = "Año: " + pelicula.Year;
          salida.innerText = "Año de salida: " + pelicula.Released;
          dinero.innerText = "Dinero generado: " + pelicula.BoxOffice;

          calificaciones.innerHTML = '';
          pelicula.Ratings.forEach(calificacion => {
            const elementoCalificacion = document.createElement('p');
            elementoCalificacion.innerText = calificacion.Source + ": " + calificacion.Value;
            calificaciones.appendChild(elementoCalificacion);

            loader3.style.display="none";
          });
        })
        .catch(error => {
          console.error('Error al obtener el detalle de la película:', error);
        });
    };


const volverALista = () => {
      paginaDetalle.style.display = 'none';
      graficas.style.display = 'none';
    };




      //Graficas de barras


      function Grafica() {
  const boxOfficePeliculas = [];
  const ratingPeliculas = [];
  const votesPeliculas = [];
  graficas.style.display = 'flex';
  loader4.style.display="block";
  // Obtener los datos de las películas
  const peliculasPromises = peliculas.map(peli =>
    fetch("https://www.omdbapi.com/?apikey=9fce6812&i=" + peli)
      .then(response => response.json())
  );

  // Esperar a que todas las promesas se completen
  Promise.all(peliculasPromises)
    .then(peliculas => {
      peliculas.forEach(pelicula => {
        const boxOffice = pelicula.BoxOffice;
        const titulo = pelicula.Title;
        const rating=pelicula.imdbRating;
        const votes=pelicula.imdbVotes;
        if (boxOffice !== "N/A" && titulo) {
          boxOfficePeliculas.push([titulo, parseFloat(boxOffice.replace(/[^0-9.]+/g, ''))]);
        }if (rating!== "N/A" && titulo) {
          ratingPeliculas.push([titulo, parseFloat(rating.replace(/[^0-9.]+/g, ''))]);
        }if (votes!== "N/A" && titulo) {
          votesPeliculas.push([titulo, parseFloat(votes.replace(/[^0-9.]+/g, ''))]);
        }
      });

      // Ordenar el array de películas de mayor a menor
      boxOfficePeliculas.sort((a, b) => b[1] - a[1]);
      ratingPeliculas.sort((a, b) => b[1] - a[1]);
      votesPeliculas.sort((a, b) => b[1] - a[1]);

      console.log(boxOfficePeliculas);
      console.log(ratingPeliculas);
      console.log(votesPeliculas);
      // Llamar a la función para dibujar la gráfica
      drawChart(boxOfficePeliculas,1);
      drawChart(ratingPeliculas,2);
      drawChart(votesPeliculas,3);
      loader4.style.display="none";
    })
    .catch(error => {
      console.log('Error al obtener información de las películas:', error);
    });
}

function drawChart(datos, numero) {
  google.charts.load("current", { packages: ["corechart"] });
  if(numero==1){
  google.charts.setOnLoadCallback(() => {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Título');
    data.addColumn('number', 'Box Office');
    data.addRows(datos);

    var options = {
      title: "Ranking de películas con mayor box office",
      width: 500,
      height: 300,
      bar: { groupWidth: "95%" },
      legend: { position: "none" },
      colors: ['#5554FA'],
    };

    var chart = new google.visualization.BarChart(document.getElementById("todaslaspelis"));
    chart.draw(data, options);
  });
}if(numero==2){
  google.charts.setOnLoadCallback(() => {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Título');
    data.addColumn('number', 'ImdbRating');
    data.addRows(datos.slice(0, 5));

    var options = {
      title: "Top 5 de películas con más ranking",
      width: 500,
      height: 300,
      bar: { groupWidth: "95%" },
      legend: { position: "none" },
      colors: ['#9A6BFA'],
    };

    var chart = new google.visualization.BarChart(document.getElementById("top5rating"));
    chart.draw(data, options);
  });
}if(numero==3){
  google.charts.setOnLoadCallback(() => {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Título');
    data.addColumn('number', 'ImdbVotes');
    data.addRows(datos.slice(0, 5));

    var options = {
      title: "Top 5 de películas con más votos",
      width: 500,
      height: 300,
      bar: { groupWidth: "95%" },
      legend: { position: "none" },
      colors: ['#FA38A3'],
    };

    var chart = new google.visualization.BarChart(document.getElementById("top5votos"));
    chart.draw(data, options);
  });
}
}





window.addEventListener('scroll', cargarMasPeliculas);



inputBusqueda.addEventListener('input', buscarPeliculas);

    
    botonVolver.addEventListener('click', volverALista);
    botonVolver2.addEventListener('click', volverALista);

informe.addEventListener("click", Grafica);


}