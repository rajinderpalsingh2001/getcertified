var canvas = new fabric.Canvas('canvas');


function addcertificate() {
    var certificate = document.getElementById('certificate');
    certificate.addEventListener('change', handleImage, false);

    function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = new Image();
            img.onload = function () {
                var f_img = new fabric.Image(img);
                canvas.setBackgroundImage(f_img);
                canvas.renderAll();
                canvas.setDimensions({ width: img.width, height: img.height });
            };
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    }


    // var img = new Image();
    // img.onload = function () {
    //     var f_img = new fabric.Image(img);
    //     canvas.setBackgroundImage(f_img);
    //     canvas.width=img.width;
    //     canvas.height=img.height;
    //     canvas.renderAll();
    // };
    // var myDataURL = "pic.png";
    // img.src = myDataURL;



    // canvas.renderAll();
    // canvas.setDimensions({ width: img.width, height: img.height });

    // var canvas = new fabric.Canvas('canvas');
    // document.getElementById('file').addEventListener("change", function (e) {
    //     var file = e.target.files[0];
    //     var reader = new FileReader();
    //     reader.onload = function (f) {
    //         var data = f.target.result;
    //         fabric.Image.fromURL(data, function (img) {
    //             var oImg = img.set({ left: 0, top: 0, angle: 0, width: 100, height: 100 }).scale(0.9);
    //             canvas.add(oImg).renderAll();
    //             var a = canvas.setActiveObject(oImg);
    //             var dataURL = canvas.toDataURL({ format: 'png', quality: 0.8 });
    //         });
    //     };
    //     reader.readAsDataURL(file);
    // });
}

var csvdata=[];
function readcsv(input) {
    var file = input.files[0];
    var reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        var data=reader.result;
        var ar=[];
        data=data.replace(/\r/g, "").split(/\n/);

        for(i=0;i<data.length;i++){
            ar[i]=[];
            var d=data[i].split(',');
            for(j=0;j<d.length;j++){
                ar[i][j]=d[j];
            }            
        }        
        csvdata=ar;
        console.log(csvdata)
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}
// window.load = (addcertificate());

// canvas.on('object:moving', function (options) {
//     // localStorage.setItem("lastname", "Smith");
//     console.log(options.left);
// })
canvas.on('after:render', function (options) {
    // localStorage.setItem("lastname", "Smith");
})

function deleteSelectedObject() {
    canvas.remove(canvas.getActiveObject());
}

var objs = [];
var objcounter = 0;
function addtext(defaulttext) {
    var n = new fabric.Text(defaulttext, {
        fontFamily: 'Delicious_500',
        fill: 'white',
        fontSize: 90,
        top: 470,
        left: 500
    });

    objs[objcounter] = n;
    objcounter++;

    console.log(n.left);
    console.log(n.top);
    console.log(n)
    canvas.add(n);

    canvas.item(canvas.getObjects().length - 1).set({
        borderColor: 'black',
        cornerColor: 'red',
        cornerSize: 30,
        transparentCorners: false
    });
    canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));
}
function changeText(newtext) {
    var obj = canvas.getActiveObject();
    obj.text = newtext;
    canvas.renderAll();
}

function download() {
    var c = document.getElementById('canvas');

    canvas.discardActiveObject().renderAll();

    var link = document.createElement('a');
    link.download = 'image.png';
    link.href = c.toDataURL();
    link.click();
}

function generateCertificates() {
    var names = ["Rajinderpal Singh", "Paramjit Kaur", "Navjot Kaur"]
    for (var i = 0; i < names.length; i++) {
        canvas.setActiveObject(canvas.item(0));
        changeText(names[i]);
        download();
    }
}

function setpositions() {
    if (document.querySelector('#setpositions').checked) {
        console.log("positions set");
    } else {
        console.log("positions nt set");
    }
}