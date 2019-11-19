
var db = firebase.database();
function Swich(informacion, Status) {
    if (informacion == 'foco1') {
        if (Status) {
            db.ref('/').update({
                foco1: 1
            });
            Mensajes('Foco Encendido',1);
        } else {
            db.ref('/').update({
                foco1: 0
            });
            Mensajes('Foco Apagado',1);
        }
    } else {
        if (informacion == 'foco2') {
            if (Status) {
                db.ref('/').update({
                    foco2: 1
                });
                Mensajes('Foco Encendido',1);
            } else {
                db.ref('/').update({
                    foco2: 0
                });
                Mensajes('Foco Apagado',1);
            }
        } else {
            if (informacion == 'foco3') {
                if (Status) {
                    db.ref('/').update({
                        foco3: 1
                    });
                    Mensajes('Foco Encendido',1);
                } else {
                    db.ref('/').update({
                        foco3: 0
                    });
                    Mensajes('Foco Apagado',1);
                }
            } else {
                if (informacion == 'puerta') {
                    db.ref('/').update({
                        puerta: 1
                    });
                }
                Mensajes('Puerta abierta',1);
                Mensajes('La puerta se cerrara en 5 segundos',2);
            }
        }
    }
}

function FormatoHora(Hora){
    let numero;
    switch(Hora){
        case 1:
                numero=13;
            break;
        case 2:
                numero=14;
            break;
        case 3:
                numero=15;
            break;
        case 4:
                numero=16;
            break;
        case 5:
                numero=17;
            break;
        case 6:
                numero=18;
            break;
        case 7:
                numero=19;
            break;
        case 8:
                numero=20;
            break;
        case 9:
                numero=21;
            break;
        case 10:
                numero=22;
            break;
        case 11:
                numero=23;
            break;
        case 12:
                numero=24;
            break;
    }
    return numero;
}
function Enchufe(){
    //inico
    let inicio=atrapadato('inico');
    let apaga=atrapadato('fin');
    let inicioHoras,inicioMinutos;
    let finHoras,finMinutos;
    inicioHoras=parseInt(inicio[0]+inicio[1]);
    inicioMinutos=parseInt(inicio[3]+inicio[4]);
    finHoras=parseInt(apaga[0]+apaga[1]);
    finMinutos=parseInt(apaga[3]+apaga[4]);
    
    //FormatoHora includes

    if(inicio.includes('PM')&&apaga.includes('PM')){
        inicioHoras=FormatoHora(inicioHoras);
        finHoras=FormatoHora(finHoras);
    }else{
        if(inicio.includes('PM')){
            inicioHoras=FormatoHora(inicioHoras);
        }else{
            if(apaga.includes('PM')){
                finHoras=FormatoHora(finHoras);
            }
        }
    }
    if(inicioHoras<finHoras){
        db.ref('/').update({
            enchufe:{
                apaga:{
                    hora:finHoras,
                    minuto:finMinutos
                },prende:{
                    hora:inicioHoras,
                    minuto:inicioMinutos
                }
            }
        });
        Mensajes('Hora Guardada correctamente',1)
        
    }else{
        Mensajes('Error Datos incorrectos',0);
        
    }  
}

function select() {
    //[0]->Enchufe [1]->foco1 [2]->foco2 [3]->foco3
    let cuenta = 0;
    let state = {};
    const itemref = db.ref('/');
    itemref.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        for (let item in items) {
            if (cuenta == 1) {
                state = {
                    foco1: items[item]
                }
            } else {
                if (cuenta == 2) {
                    state = {
                        foco2: items[item]
                    }
                } else {
                    if (cuenta == 3) {
                        state = {
                            foco3: items[item]
                        }
                    }
                }
            }
            cuenta += 1;
        }
    })
    console.log(state);
}


function atrapadato(id){
    return document.getElementById(id).value;
}

function Mensajes(mensaje,tipo){
    if(tipo==1){
        M.toast({
            html: mensaje,
            classes:'blue darken-2'
        });
    }else{
        if(tipo==0){
            M.toast({
             html: mensaje,
                classes:'red lighten-1'
            });
        }else{
            if(tipo==2){
                M.toast({
                    html: mensaje,
                    classes:'green'
                });
            }
        }
        
    }
    
}
