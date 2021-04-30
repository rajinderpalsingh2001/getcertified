var canvas = new fabric.Canvas('canvas');
var objcounter = 0;
var objs = [];
var csvdata = [];
// var imgdata=[];

function addcertificate() {
    canvas.clear();

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
    var l = String(input.value).split('.');
    var extension = l[l.length - 1].toLowerCase();
    if (extension != 'csv') {
        alert("Only CSV files are compatible");
        input.value='';
    } else {
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
            console.log(reader.error);
        };
    }
}
canvas.on('selection:cleared', function (options) {
    $('#editfield').fadeOut();
})
canvas.on('selection:created', function (options) {
    $('#editfield').fadeIn();
})

function changeFontStyle(fontvalue) {
    var obj = canvas.getActiveObject();
    obj.fontFamily = fontvalue;
    canvas.renderAll();
}
function changeFontColor(colorvalue) {
    var obj = canvas.getActiveObject();
    obj.set({ fill: colorvalue })
    canvas.renderAll();
}

function displaydatafield(csvdata) {
    var headings = csvdata[0];
    var fields = document.getElementById('fields');
    var temp = '<table>';
    var btnids = '', deleteids = '';
    for (i = 0; i < headings.length; i++) {
        btnids = headings[i] + 'btn';
        deleteids = headings[i] + 'deletebtn';
        editids = headings[i] + 'editbtn'
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
        fill: '#fffdsd',
        fontSize: 90,
        top: canvas.height / 2,
        left: canvas.width / 2,
        id: objcounter
    });
    objcounter++;

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