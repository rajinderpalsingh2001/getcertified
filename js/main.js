var canvas = new fabric.Canvas('canvas');
var objcounter = 0;
var objs = [];
var csvdata = [];
var alignvariable = "not";


function checkemptycanvas() {
    if (canvas.getObjects().length == 0) {
        return true;
    } else {
        return false;
    }
}

function addcertificate() {
    var certificate = document.getElementById('certificate');
    if (certificate.files.length <= 0) {
        alert("No Certificate Selected");
    } else {

        // canvas.clear();
        // document.getElementById('fields').innerHTML = '';

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
}

function deleteallobjects() {
    var obj = canvas.getObjects();
    for (i = 0; i < obj.length; i++) {
        canvas.remove(obj[i]);
    }
    objs = [];
    csvdata = [];
}

// var csvfilename = '';
function readcsv(input) {

    var l = String(input.value).split('.');
    var extension = l[l.length - 1].toLowerCase();
    if (extension != 'csv') {
        alert("Only CSV files are compatible");
        input.value = '';
        document.getElementById('fields').innerHTML = '';
    } else {
        // csvfilename = String(input.value).replace(/.*(\/|\\)/, '');
        // csvfilename = csvfilename.split('.')[0];
        deleteallobjects();
        var file = input.files[0];
        var reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
            csvdata = $.csv.toArrays(reader.result)
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

function checkemptycanvas() {

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
    if (checkemptycanvas()) {
        document.getElementById('generatecertificatebtn').disabled = true;
    } else {
        document.getElementById('generatecertificatebtn').disabled = false;
    }
    document.getElementById(btnid).disabled = true;
    document.getElementById(btnid.slice(0, btnid.length - 3) + 'deletebtn').disabled = false;
}
function enablebutton(deleteid) {
    if (checkemptycanvas()) {
        document.getElementById('generatecertificatebtn').disabled = true;
    } else {
        document.getElementById('generatecertificatebtn').disabled = false;
    }
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
function alignit() {
    // var activeObj = canvas.getActiveObject();
    canvas.getActiveObject().centerH();
    canvas.getActiveObject().setCoords();
    canvas.renderAll();
    // console.log(activeObj)
    // // activeObj.width=2000;
    // var centerX=activeObj.getCenterPoint()['x'];
    // var centerY=activeObj.getCenterPoint()['y'];

    // console.log(eval(String((canvas.width/2)-centerX)))

    // activeObj.set({ width: 2000 });
    // activeObj.setCoords()
    // canvas.renderAll()
    // console.log(canvas.width/2);
    // console.log(canvas.height);
}
function setAlign(align, canvas) {
    let activeObj = canvas.getActiveObject(),
        horizontalCenter = (activeObj.width * activeObj.scaleX) / 2,
        verticalCenter = (activeObj.height * activeObj.scaleY) / 2,
        { width, height } = canvas

    switch (align) {
        case 'top':
            activeObj.set({ top: verticalCenter })
            break
        case 'left':
            activeObj.set({ left: horizontalCenter })
            break
        case 'bottom':
            activeObj.set({ top: height - verticalCenter })
            break
        case 'right':
            activeObj.set({ left: width - horizontalCenter })
            break
        case 'center':
            activeObj.set({ left: (width / 2) })
            break
        case 'middle':
            activeObj.set({ top: (height / 2) })
            break
    }

    activeObj.setCoords()
    canvas.renderAll()
}

function addtext(defaulttext) {
    var n = new fabric.Text(defaulttext, {
        fontFamily: 'Delicious_500',
        fill: 'black',
        fontSize: 90,
        top: canvas.height / 2,
        left: canvas.width / 2,
        textAlign: "center",
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
    loader('show');
    setTimeout(function () {
        var zip = new JSZip();
        var folder = zip.folder('certificates');
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
                        flag = 1;
                        canvas.setActiveObject(canvas.item(objids[i]['id']));
                        changeText(csvdata[o][j]);
                        if (alignvariable == 'center') {
                            alignit('center');
                        }
                        // setAlign('middle',canvas);
                    }
                }
            }
            if (flag == 1) {

                // add to zip folder
                var c = document.getElementById('canvas');
                canvas.discardActiveObject().renderAll();
                var imgd = c.toDataURL().split(';base64,')[1]
                folder.file(`${n}.png`, imgd, { base64: true });
                console.log(n + " certificate generated")
                n++;
            }
        }
        // save file

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                // see FileSaver.js
                saveAs(content, "getCertified.zip");
                loader('hide');
                deleteallobjects();
            });
    }, 1000);
}

function loader(action) {
    var body = document.getElementsByTagName("body");
    var head = document.getElementsByTagName("head");
    switch (action) {
        case 'show':
            var style = document.createElement('style');
            var div = document.createElement("div");
            var css = ".sk-chase {\n" +
                "            width: 40px;\n" +
                "            height: 40px;\n" +
                "            position: relative;\n" +
                "            animation: sk-chase 2.5s infinite linear both;\n" +
                "        }\n" +
                "\n" +
                "        .sk-chase-dot {\n" +
                "            width: 100%;\n" +
                "            height: 100%;\n" +
                "            position: absolute;\n" +
                "            left: 0;\n" +
                "            top: 0;\n" +
                "            animation: sk-chase-dot 2.0s infinite ease-in-out both;\n" +
                "        }\n" +
                "\n" +
                "        .sk-chase-dot:before {\n" +
                "            content: '';\n" +
                "            display: block;\n" +
                "            width: 25%;\n" +
                "            height: 25%;\n" +
                "            background-color: #fff;\n" +
                "            border-radius: 100%;\n" +
                "            animation: sk-chase-dot-before 2.0s infinite ease-in-out both;\n" +
                "        }\n" +
                "\n" +
                "        .sk-chase-dot:nth-child(1) { animation-delay: -1.1s; }\n" +
                "        .sk-chase-dot:nth-child(2) { animation-delay: -1.0s; }\n" +
                "        .sk-chase-dot:nth-child(3) { animation-delay: -0.9s; }\n" +
                "        .sk-chase-dot:nth-child(4) { animation-delay: -0.8s; }\n" +
                "        .sk-chase-dot:nth-child(5) { animation-delay: -0.7s; }\n" +
                "        .sk-chase-dot:nth-child(6) { animation-delay: -0.6s; }\n" +
                "        .sk-chase-dot:nth-child(1):before { animation-delay: -1.1s; }\n" +
                "        .sk-chase-dot:nth-child(2):before { animation-delay: -1.0s; }\n" +
                "        .sk-chase-dot:nth-child(3):before { animation-delay: -0.9s; }\n" +
                "        .sk-chase-dot:nth-child(4):before { animation-delay: -0.8s; }\n" +
                "        .sk-chase-dot:nth-child(5):before { animation-delay: -0.7s; }\n" +
                "        .sk-chase-dot:nth-child(6):before { animation-delay: -0.6s; }\n" +
                "\n" +
                "        @keyframes sk-chase {\n" +
                "            100% { transform: rotate(360deg); }\n" +
                "        }\n" +
                "\n" +
                "        @keyframes sk-chase-dot {\n" +
                "            80%, 100% { transform: rotate(360deg); }\n" +
                "        }\n" +
                "\n" +
                "        @keyframes sk-chase-dot-before {\n" +
                "            50% {\n" +
                "                transform: scale(0.4);\n" +
                "            } 100%, 0% {\n" +
                "                  transform: scale(1.0);\n" +
                "              }\n" +
                "        }"
            style.type = 'text/css';
            if (style.styleSheet) {
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            div.id = "loader";
            div.style.cssText = "position: fixed;\n" +
                "            z-index:5000;\n" +
                "            width: 100%;\n" +
                "            height: 100%;\n" +
                "            background: rgba(4,4,4,0.8);";
            div.innerHTML = '<div style="margin:auto;\n' +
                '            position: absolute;\n' +
                '            top:46%;\n' +
                '            left:46%;">\n' +
                '<div class="sk-chase">\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '</div>' +
                '<div style="text-align:center;color:white;" id="certificatenumber"></div>' +
                '    </div>'
            head[0].appendChild(style);
            body[0].prepend(div);
            break;
        case 'hide':
            body[0].removeChild(document.getElementById('loader'));
            head[0].removeChild(head[0].lastChild);
            break;
    }
}

function setpositions() {
    if (document.querySelector('#setpositions').checked) {
        alignvariable = "center";
    } else {
        alignvariable = "not";
    }
}

function viewcsvdata() {
    if (csvdata.length != 0) {
        $('#data').addClass('databackground');
        document.getElementById('data').style.display = "block";

        var output = document.querySelector('.csvdata');
        var temp = '';
        temp += '<table class="table bg-light">' +
            '<thead>' +
            '<tr>' +
            `<th scope="col">Serial No. </th>`;
        for (i = 0; i < csvdata[0].length; i++) {
            temp += `<th scope="col">${csvdata[0][i]}</th>`;
        }
        temp += '</tr>' +
            '</thead>';

        temp += '<tbody>';
        for (i = 1; i < csvdata.length; i++) {
            temp += '<tr>';
            temp += `<th scope="row">${i}</th>`;
            for (j = 0; j < csvdata[i].length; j++) {
                temp += `<td>${csvdata[i][j]}</td>`;
            }
            temp += '</tr>'
        }
        temp += '</tbody>' +
            '</table>';

        output.innerHTML = temp;
    }
}

function fonts() {
    fontsarray = [
        'Abadi MT Condensed Light', 'Aharoni', 'Aharoni Bold', 'Aldhabi', 'AlternateGothic2 BT', 'Andale Mono', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Aparajita', 'Apple Chancery', 'Arabic Typesetting', 'Arial', 'Arial Black', 'Arial narrow', 'Arial Nova', 'Arial Rounded MT Bold', 'Arnoldboecklin', 'Avanta Garde',
        'Bahnschrift', 'Bahnschrift Light', 'Bahnschrift SemiBold', 'Bahnschrift SemiLight', 'Baskerville', 'Batang', 'BatangChe', 'Big Caslon', 'BIZ UDGothic', 'BIZ UDMincho Medium', 'Blippo', 'Bodoni MT', 'Book Antiqua', 'Bookman', 'Bradley Hand', 'Browallia New', 'BrowalliaUPC', 'Brush Script MT', 'Brush Script Std', 'Brushstroke',
        'Calibri', 'Calibri Light', 'Calisto MT', 'Cambodian', 'Cambria', 'Cambria Math', 'Candara', 'Century Gothic', 'Chalkduster', 'Cherokee', 'Comic Sans', 'Comic Sans MS', 'Consolas', 'Constantia', 'Copperplate', 'Copperplate Gothic Light', 'Copperplate Gothic Bold', 'Corbel', 'Cordia New', 'CordiaUPC', 'Coronetscript', 'Courier', 'Courier New',
        'DaunPenh', 'David', 'DengXian', 'DFKai-SB', 'Didot', 'DilleniaUPC', 'DokChampa', 'Dotum', 'DotumChe',
        'Ebrima', 'Estrangelo Edessa', 'EucrosiaUPC', 'Euphemia',
        'FangSong', 'Florence', 'Franklin Gothic Medium', 'FrankRuehl', 'FreesiaUPC', 'Futara',
        'Gabriola', 'Gadugi', 'Garamond', 'Gautami', 'Geneva', 'Georgia', 'Georgia Pro', 'Gill Sans', 'Gill Sans Nova', 'Gisha', 'Goudy Old Style', 'Gulim', 'GulimChe', 'Gungsuh', 'GungsuhChe',
        'Hebrew', 'Hoefler Text', 'HoloLens MDL2 Assets',
        'Impact', 'Ink Free', 'IrisUPC', 'Iskoola Pota', 'Japanese', 'JasmineUPC', 'Javanese Text', 'Jazz LET',
        'KaiTi', 'Kalinga', 'Kartika', 'Khmer UI', 'KodchiangUPC', 'Kokila', 'Korean',
        'Lao', 'Lao UI', 'Latha', 'Leelawadee', 'Leelawadee UI', 'Leelawadee UI Semilight', 'Levenim MT', 'LilyUPC', 'Lucida Bright', 'Lucida Console', 'Lucida Handwriting', 'Lucida Sans', 'Lucida Sans Typewriter', 'Lucida Sans Unicode', 'Lucidatypewriter', 'Luminari',
        'Malgun Gothic', 'Malgun Gothic Semilight', 'Mangal', 'Marker Felt', 'Meiryo', 'Meiryo UI', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft JhengHei UI', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft Uighur', 'Microsoft YaHei', 'Microsoft YaHei UI', 'Microsoft Yi Baiti', 'MingLiU', 'MingLiU_HKSCS', 'MingLiU_HKSCS-ExtB', 'MingLiU-ExtB', 'Miriam', 'Monaco', 'Mongolian Baiti', 'MoolBoran', 'MS Gothic', 'MS Mincho', 'MS PGothic', 'MS PMincho', 'MS UI Gothic', 'MV Boli', 'Myanmar Text',
        'Narkisim', 'Neue Haas Grotesk Text Pro', 'New Century Schoolbook', 'News Gothic MT', 'Nirmala UI', 'No automatic language associations', 'Noto', 'NSimSun', 'Nyala',
        'Oldtown', 'Optima',
        'Palatino', 'Palatino Linotype', 'papyrus', 'Parkavenue', 'Perpetua', 'Plantagenet Cherokee', 'PMingLiU',
        'Raavi', 'Rockwell', 'Rockwell Extra Bold', 'Rockwell Nova', 'Rockwell Nova Cond', 'Rockwell Nova Extra Bold', 'Rod',
        'Sakkal Majalla', 'Sanskrit Text', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Historic', 'Segoe UI Symbol', 'Shonar Bangla', 'Shruti', 'SimHei', 'SimKai', 'Simplified Arabic', 'Simplified Chinese', 'SimSun', 'SimSun-ExtB', 'Sitka', 'Snell Roundhan', 'Stencil Std', 'Sylfaen', 'Symbol',
        'Tahoma', 'Thai', 'Times New Roman', 'Traditional Arabic', 'Traditional Chinese', 'Trattatello', 'Trebuchet MS', 'Tunga',
        'Utsaah',
        'Vani', 'Verdana', 'Verdana Pro', 'Vijaya', 'Vrinda',
        'Yu Gothic', 'Yu Gothic UI', 'Yu Mincho',
        'Zapf Chancery'
    ]

    var list = document.getElementById('fonts');

    fontsarray.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item;
        list.appendChild(option);
    });
}