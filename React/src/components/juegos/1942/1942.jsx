import './1942.css'
import { objeto, proyectil, nave, enemigo } from "../objeto"
import { gameArea } from "../canvas";
import { useEffect, useRef } from 'react';

function Guerra() 
{
    const gameContainer = useRef(null);

    let player;
    let canvas = new gameArea(300, 200);
    let interval = null;
    let started = false;

    let proyectiles = [];
    let disparoActual = 1;

    let izquierda = false;
    let derecha = false;
    let arriba = false;
    let abajo = false;

    useEffect(() => {
        document.addEventListener('keydown', teclasApretadas);
        document.addEventListener('keyup', teclasSoltadas);
            
        // Limpia el intervalo y los listeners cuando el componente se desmonte
        return () => {
            clearInterval(interval);
            document.removeEventListener('keydown', teclasApretadas);
            document.removeEventListener('keyup', teclasSoltadas);
        };
    }, []);

    function startGame()
    {
        try
        {
            //Se asegura de que el canvas exista antes de intentar removerlo
            if (canvas.canvas) {
                canvas.canvas.remove();
            }
            clearInterval(interval);
            interval = setInterval(updateGameArea, 20);
        }
        catch (e) {
            console.error("Error al reiniciar el juego:", e);
        }

        player = new nave(10, 10, 145, 95, ['./space_3.png'], 5, false);
        canvas = new gameArea(300, 200);

        proyectiles = [];
        disparoActual = 1;

        canvas.start(gameContainer.current); 
        document.getElementById('startButton').style.display = 'none';
        started = true;
    }

    function updateGameArea()
    {
        if(started)
        {
            canvas.clear();
            let x, y;
            if(arriba == true) y = -1;
            else if(abajo == true) y = 1;
            else y = 0;
            if(izquierda == true) x = -1;
            else if(derecha == true) x = 1;
            else x = 0;

            player.move(x, y, canvas);
            player.update(canvas);
        }
    }

    function teclasApretadas(event)
    {
        if(event.keyCode === 32) event.preventDefault();
        
        if(event.keyCode === 32) //Espacio
        {
            disparoJugador();
        }
        if(event.keyCode === 39 || event.keyCode === 68)
        {
            derechaTrue();
        }
        if(event.keyCode === 37 || event.keyCode === 65)
        {
            izquierdaTrue();
        }
        if(event.keyCode === 40 || event.keyCode === 83)
        {
            abajoTrue();
        }
        if(event.keyCode === 38 || event.keyCode === 87)
        {
            arribaTrue();
        }
    }

    function teclasSoltadas(event)
    {
        if(event.keyCode === 39 || event.keyCode === 68)
        {
            derechaFalse();
        }
        if(event.keyCode === 37 || event.keyCode === 65)
        {
            izquierdaFalse();
        }
        if(event.keyCode === 40 || event.keyCode === 83)
        {
            abajoFalse();
        }
        if(event.keyCode === 38 || event.keyCode === 87)
        {
            arribaFalse();
        }
    }

    function disparoJugador()
    {

    }

    function derechaTrue(){derecha = true;}
    function derechaFalse(){derecha = false;}
    function izquierdaTrue(){izquierda = true;}
    function izquierdaFalse(){izquierda = false;}
    function arribaTrue(){arriba = true;}
    function arribaFalse(){arriba = false;}
    function abajoTrue(){abajo = true;}
    function abajoFalse(){abajo = false;}

    return (  
        <div ref={gameContainer} className="relative w-full h-full flex flex-col items-center"> 
            <button onClick={startGame} id="startButton"  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ">Jugar</button>
        </div>
    );
}

export default Guerra;