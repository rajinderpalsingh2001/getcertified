var canvas = new fabric.Canvas('canvas');
var objcounter=0;
var objs=[];

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

var csvdata = [];
function readcsv(input) {
    var file = input.files[0];
    var reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        var data = reader.result;
        var ar = [];
        data = data.replace(/\r/g, "").split(/\n/);

        for (i = 0; i < data.length; i++) {
            ar[i] = [];
            var d = data[i].split(',');
            for (j = 0; j < d.length; j++) {
                ar[i][j] = d[j];
            }
        }
        csvdata = ar;

        // console.log(csvdata)
        displaydatafield(csvdata);
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}


function displaydatafield(csvdata) {
    var headings = csvdata[0];
    var fields = document.getElementById('fields');
    var temp = '<table>';
    var counter=0;
    var btnids='',deleteids='';
    for (i = 0; i < headings.length; i++) {            
          btnids='btn'+counter;
          deleteids='deletebtn'+counter;
          temp+='<tr>'+
                    '<td><span>'+headings[i]+'</span></td>' +
                    '<td><button type="button" class="btn btn-success" id="'+btnids+'" onclick=\"addtext(\''+headings[i]+'\'),disablebutton(this.id)\">Add</button></td>' +                    
                    '<td><button type="button" disabled class="btn btn-danger" id="'+deleteids+'" onclick=\"deletetext(\''+headings[i]+'\'),enablebutton(this.id)\">Delete</button></td>' +
                '</tr>';
                counter++;
    }
    temp+='</table>';
    fields.innerHTML=temp;
}

function disablebutton(btnid){
    document.getElementById(btnid).disabled=true;
    document.getElementById('deletebtn'+btnid[btnid.length-1]).disabled=false;
}
function enablebutton(deleteid){
    document.getElementById(deleteid).disabled=true;
    document.getElementById('btn'+deleteid[deleteid.length-1]).disabled=false;
}

function deletetext(textval){
    for(i=0;i<objs.length;i++){        
        if(objs[i].text==textval){
            selectobject(objs[i].id);
            deleteSelectedObject();
            objs=canvas.getObjects();
        }
    }
}
function selectobject(elid){    
    for(i=0;i<objs.length;i++){
        if(objs[i].id==elid){
            canvas.item(i).set({
                borderColor: 'black',
                cornerColor: 'red',
                cornerSize: 30,
                transparentCorners: false
            });
            canvas.setActiveObject(canvas.item(i));
        }
    }
}
function deleteSelectedObject() {
    canvas.remove(canvas.getActiveObject());
}

// window.load = (addcertificate());

// canvas.on('object:moving', function (options) {
//     // localStorage.setItem("lastname", "Smith");
//     console.log(options.left);
// })
canvas.on('after:render', function (options) {
    // localStorage.setItem("lastname", "Smith");
})


function addtext(defaulttext) {
    var n = new fabric.Text(defaulttext, {
        fontFamily: 'Delicious_500',
        fill: 'white',
        fontSize: 90,
        top: 470,
        left: 500,
        id:objcounter
    });
    objcounter++;
    // console.log(n.left);
    // console.log(n.top);
    // console.log(n)

    canvas.add(n);

    canvas.item(canvas.getObjects().length - 1).set({
        borderColor: 'black',
        cornerColor: 'red',
        cornerSize: 30,
        transparentCorners: false
    });
    canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));
    objs=canvas.getObjects();
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
    console.log(csvdata)
    var objids=[]
    for(var i=0; i<objs.length; i++){
        var obj = { "id": objs[i].id, "value": objs[i].text};
        objids.push(obj);
    }

    for(i=1;i<csvdata.length;i++){
        for(j=0;j<csvdata[i].length;j++){
            
            console.log(csvdata[0][j])     
            // console.log(csvdata[i][j])
        }
    }
    
    
    // var names = ["Rajinderpal Singh", "Paramjit Kaur", "Navjot Kaur"]
    // for (var i = 0; i < names.length; i++) {
    //     canvas.setActiveObject(canvas.item(0));
    //     changeText(names[i]);
    //     download();
    // }
}

function setpositions() {
    if (document.querySelector('#setpositions').checked) {
        console.log("positions set");
    } else {
        console.log("positions nt set");
    }
}