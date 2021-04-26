var canvas = new fabric.Canvas('canvas');

function addcertificate() {
    var img = new Image();
    img.onload = function () {
        var f_img = new fabric.Image(img);
        canvas.setBackgroundImage(f_img);
        canvas.renderAll();
    };
    var myDataURL = "pic.png";
    img.src = myDataURL;

    canvas.setDimensions({ width: img.width, height: img.height });
}

window.load = (addcertificate());

canvas.on('object:moving', function (options) {
    // localStorage.setItem("lastname", "Smith");
    console.log(options.left);
})

function deleteSelectedObject() {
    canvas.remove(canvas.getActiveObject());
}

function addtext(defaulttext) {
    var n = new fabric.Text(defaulttext, {
        fontFamily: 'Delicious_500',
        fill:'white',
        fontSize: 90,
        top: 470,
        left: 500
    });
    console.log(n.left);
    console.log(n.top);
    console.log(n)
    canvas.add(n);
    
    canvas.item(canvas.getObjects().length-1).set({
        borderColor: 'black',
        cornerColor: 'red',
        cornerSize: 30,
        transparentCorners: false
    });
    canvas.setActiveObject(canvas.item(canvas.getObjects().length-1));
}
function changeText(newtext) {
    var obj=canvas.getActiveObject();    
    obj.text=newtext;
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

function generateCertificates(){
    var names=["Rajinderpal Singh","Paramjit Kaur","Navjot Kaur"]
    for(var i=0;i<names.length;i++){
        canvas.setActiveObject(canvas.item(0));
        changeText(names[i]);
        download();
    }
}