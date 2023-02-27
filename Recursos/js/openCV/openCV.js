/*Archivos JS encargado de la implementación y uso de OpenCV*/

let enlace;
let detectado = false;
let imgElement2 = document.getElementById('imageSrc2');
let inputElement = document.getElementById('fileInput');


function ejecutar() {
	let canvas = document.getElementById("canvasOutput");
	let imgElement = document.getElementById('imageSrc');
	let imgElement3 = document.getElementById('imagenFiltro');
	let src = cv.imread(imgElement);
	let templ = cv.imread(imgElement3);
	let dst = new cv.Mat();
	let mask = new cv.Mat();
	cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF, mask);
	let result = cv.minMaxLoc(dst, mask);
	let maxPoint = result.maxLoc;
	let color = new cv.Scalar(255, 0, 0, 255);
	let point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows);
	cv.rectangle(src, maxPoint, point, color, 2, cv.LINE_8, 0);
	cv.imshow('canvasOutput', src);
	enlace = document.createElement('a');
	enlace.href = canvas.toDataURL();
	detectado = true;
	dst.delete(); mask.delete();
}

inputElement.addEventListener('change', (e) => {
	imgElement2.src = URL.createObjectURL(e.target.files[0]);
}, false);


//Función que se activa al cargar una imagen
imgElement2.onload = function () {

	//Lectura de la imagen
	let src = cv.imread(imgElement2);

	//Crea un nuevo material al que otorgaremos los valores de salida
	let dst = new cv.Mat();

	let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
	let high = new cv.Mat(src.rows, src.cols, src.type(), [150, 150, 150, 255]);
	// You can try more different parameters - Changing colorspaces
	cv.inRange(src, low, high, dst);
	cv.imshow('canvasOutput2', dst);

	//Structuring element - Morphological transformation
	cv.cvtColor(dst, dst, cv.COLOR_RGBA2RGB);
	cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
	let dst2 = new cv.Mat();
	let M = new cv.Mat();
	let ksize = new cv.Size(3, 3);
	// You can try more different parameters
	M = cv.getStructuringElement(cv.MORPH_CROSS, ksize);
	cv.morphologyEx(dst, dst2, cv.MORPH_GRADIENT, M);
	cv.morphologyEx(src, dst, cv.MORPH_GRADIENT, M);
	cv.imshow('canvasOutput3', dst);
	cv.imshow('canvasOutput4', dst2);
	src.delete(); dst.delete(); low.delete(); high.delete(); dst2.delete();
};



//Realizar algo en tiempo de ejecución

//var Module = {
//	onRuntimeInitialized() {
//		alert("hola");
//	}
//};
