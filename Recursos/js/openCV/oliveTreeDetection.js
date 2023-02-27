/*Archivos JS encargado de la implementación y uso de OpenCV*/
var enlace = "";
var detectado = false;

// Resize image
function resize(matriz, width) {
    if (matriz.size().width <= width)
        return matriz;
    var yf = parseFloat(width) / parseFloat(matriz.size().width);
    let mat2 = new cv.Mat();
    let size = new cv.Size(width, matriz.size.height * yf);
    cv.resize(matriz, mat2, size, 0, 0, cv.INTER_AREA)
    return mat2;
}

function filtroContornos(puntos, areaMinima, epsilon) {

    var filtrado = new cv.MatVector();
    for (var i = 0; i < puntos.size(); i++) {

        var aproximacion = new cv.Mat();
        var area = cv.contourArea(puntos.get(i));

        if (area > areaMinima) {
            var eps = epsilon * puntos.get(i).size().height;
            cv.approxPolyDP(puntos.get(i), aproximacion, eps, true);
            //Comprobar si es convexo
            if (cv.isContourConvex(aproximacion)) {
                filtrado.push_back(aproximacion);
            }
        }

    }

    return filtrado;

}

function ejecucion() {

    let canvas = document.getElementById("canvasOutput");
    let imgElement = document.getElementById('imageSrc');
    var mat = cv.imread(imgElement);

    var grey = new cv.Mat();
    cv.cvtColor(mat, grey, cv.COLOR_RGBA2GRAY);
    var anchor = new cv.Point(-1, -1);
    cv.blur(grey, grey, new cv.Size(5, 5), anchor);

    var canny = new cv.Mat();
    var lowThreshold = 150;
    var kernel_size = 5;
    var ratio = 9;
    cv.Canny(grey, canny, lowThreshold, lowThreshold * ratio, kernel_size, true);


    var puntos = new cv.MatVector();
    let hierarchy = new cv.Mat();
    var filtrado = new cv.MatVector();
    cv.findContours(canny, puntos, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

    var minArea = 20;
    filtrado = filtroContornos(puntos, minArea, 0.1);

    for (let i = 0; i < filtrado.size(); i++)
    {
        var x = 0;
        for (let j = 0; j < filtrado.get(i).size().height ; j ++)
        {

            var punto = new cv.Point(filtrado.get(i).data32S[x], filtrado.get(i).data32S[x + 1]);
            var punto2 = new cv.Point(filtrado.get(i).data32S[(x + 2) % (filtrado.get(i).size().height * 2)], filtrado.get(i).data32S[(x + 3) % (filtrado.get(i).size().height * 2)]);
            x += 2;
            cv.line(mat, punto, punto2, new cv.Scalar(255, 0, 0, 255), 4);

        }

    }



    cv.imshow('canvasOutput', mat);
    enlace = document.createElement('a');
    enlace.href = canvas.toDataURL();
    detectado = true;

}
