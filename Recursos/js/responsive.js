/*JS encargado de creación y actualización de los listener para las acciones ocurridas al cambio de tamaños de ventana*/

var mediaqueryList = window.matchMedia("(max-width: 600px)");
function manejador(EventoMediaQueryList) {
	let myChart = Chart.getChart("grafica"); // <canvas> id
	if(EventoMediaQueryList.matches) {
		myChart.canvas.parentNode.style.width = '100%';
	} else {
		myChart.canvas.parentNode.style.width = '60%';
	}
}

// asociamos el manejador de evento
mediaqueryList.addListener(manejador);