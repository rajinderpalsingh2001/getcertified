var canvas = new fabric.Canvas('canvas');
var objcounter = 0;
var objs = [];
var csvdata = [];
// var imgdata=[];

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

function deleteallobjects() {
    var obj = canvas.getObjects();
    for (i = 0; i < obj.length; i++) {
        canvas.remove(obj[i]);
    }
    objs = [];
    csvdata = [];
}

function readcsv(input) {
    deleteallobjects();
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
        displaydatafield(csvdata);
    };

    reader.onerror = function () {
        // console.log("called")
        console.log(reader.error);
    };
}


function displaydatafield(csvdata) {
    var headings = csvdata[0];
    var fields = document.getElementById('fields');
    var temp = '<table>';
    var btnids = '', deleteids = '';
    for (i = 0; i < headings.length; i++) {
        btnids = headings[i] + 'btn';
        deleteids = headings[i] + 'deletebtn';
        temp += '<tr>' +
            '<td><span>' + headings[i] + '</span></td>' +
            '<td><button type="button" class="btn btn-success" id="' + btnids + '" onclick=\"addtext(\'' + headings[i] + '\'),disablebutton(this.id)\">Add</button></td>' +
            '<td><button type="button" disabled class="btn btn-danger" id="' + deleteids + '" onclick=\"deletetext(\'' + headings[i] + '\'),enablebutton(this.id)\">Delete</button></td>' +
            '</tr>';
    }
    temp += '</table>';
    fields.innerHTML = temp;
}

function disablebutton(btnid) {
    document.getElementById(btnid).disabled = true;
    document.getElementById(btnid.slice(0, btnid.length - 3) + 'deletebtn').disabled = false;
}
function enablebutton(deleteid) {
    document.getElementById(deleteid).disabled = true;
    document.getElementById(deleteid.slice(0, deleteid.length - 9) + 'btn').disabled = false;
}

function deletetext(textval) {
    for (i = 0; i < objs.length; i++) {
        if (objs[i].text == textval) {
            selectobject(objs[i].id);
            deleteSelectedObject();
            objs = canvas.getObjects();
        }
    }
}
function selectobject(elid) {
    for (i = 0; i < objs.length; i++) {
        if (objs[i].id == elid) {
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

function addtext(defaulttext) {
    var n = new fabric.Text(defaulttext, {
        fontFamily: 'Delicious_500',
        fill: 'white',
        fontSize: 90,
        top: 470,
        left: 500,
        id: objcounter
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
    objs = canvas.getObjects();
}

function changeText(newtext) {
    var obj = canvas.getActiveObject();
    obj.text = newtext;
    canvas.renderAll();
}


function generateCertificates() {
    var objids = [];
    var n = 0;
    for (var i = 0; i < objs.length; i++) {
        var obj = { "id": objs[i].id, "value": objs[i].text };
        objids.push(obj);
    }
    var flag = 0;
    for (o = 1; o < csvdata.length; o++) {
        flag = 0;
        for (i = 0; i < objids.length; i++) {
            for (j = 0; j < csvdata[0].length; j++) {
                if (objids[i]['value'] == csvdata[0][j]) {
                    // console.log(objids[i]['value'])
                    flag = 1;
                    canvas.setActiveObject(canvas.item(objids[i]['id']));
                    changeText(csvdata[o][j]);
                }
            }
        }
        if (flag == 1) {
            download(n);
            // imgdata[n]=canvas.toDataURL();
            n++;
        }
    }
}
function download(name) {
    var c = document.getElementById('canvas');

    canvas.discardActiveObject().renderAll();

    var link = document.createElement('a');
    link.download = name;
    link.href = c.toDataURL();
    link.click();
    // tozip();
}
// function tozip() {
//     var zip = new JSZip();
//     // var img = zip.folder("images");
//     // img.file("smile.gif", imgData, { base64: true });
//     for (i of imgdata){
//         zip.file("name", i, { base64: true });
//     }
        
//     zip.generateAsync({ type: "blob" })
//         .then(function (content) {
//             // see FileSaver.js
//             saveAs(content, "example.zip");
//         });
// }