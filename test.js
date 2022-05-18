
function Teleport(i){
    const tel1 = [document.getElementById("red1"),document.getElementById("green1"),document.getElementById("blue1")]
    const tel2= [document.getElementById("red2"),document.getElementById("green2"),document.getElementById("blue2")]
    const tel3 = [document.getElementById("red3"),document.getElementById("green3"),document.getElementById("blue3")]
    tel1.forEach(element => {
        element.hidden = true;
    });
    tel2.forEach(element => {
        element.hidden = true;
    });
    tel3.forEach(element => {
        element.hidden = true;
    });
    document.getElementById("teleport1").disabled =false;
    document.getElementById("teleport2").disabled =false;
    document.getElementById("teleport3").disabled =false;
    if(i==1){
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "http://localhost:3000/silversky/playercords/update/1", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            x: 45.5,
            y: 2,
            z: -10 
        }));
        document.getElementById("teleport1").disabled =true;
        tel1.forEach(element => {
            element.hidden = false;
        });
    }else if(i==2){
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "http://localhost:3000/silversky/playercords/update/1", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            x: -19.2,
            y: 2,
            z: -10 
        }));
        document.getElementById("teleport2").disabled =true;
        tel2.forEach(element => {
            element.hidden = false;
        });
    }else if(i==3){
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "http://localhost:3000/silversky/playercords/update/1", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            x: -85.5,
            y: 2,
            z: -10 
        }));
        document.getElementById("teleport3").disabled =true;
        tel3.forEach(element => {
            element.hidden = false;
            
        });
    }
    
}

function PlaneColor(i,colorText){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:3000/silversky/plane/update/"+i, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        color: colorText
    }));
    
}

function ChangeScene(i,colorText){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:3000/silversky/plane/update/"+i, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        color: colorText
    }));
    
}