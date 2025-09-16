import './1942.css'
import { objeto, proyectil, nave, enemigo } from "../objeto"
import { escuadron, boss, formacion } from './escuadron';
import { gameArea } from "../canvas";
import { useEffect, useRef } from 'react';
import { useState } from "react";
import PantallaPerdiste from '../../pantallaPerdiste';

function Guerra() 
{
    const gameContainer = useRef(null);
    const [gameOverScreen, setGameOverScreen] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    let player;
    let canvas = new gameArea(300, 200);
    let interval = null;
    let started = false;

    let proyectiles = [];
    let puntuacion = 0;
    let cooldown = 15;
    let invincibilidad = 40;
    let inviciTempo = 0;

    let izquierda = false;
    let derecha = false;
    let arriba = false;
    let abajo = false;

    let escuadrones = [];
    let dificultad = 1;
    let rondasJefe = 8;
    let rondas = 0;

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

        player = new nave(10, 10, 145, 95, ['./space_3.png'], 10, false);
        canvas = new gameArea(300, 200);

        proyectiles = [];
        cooldown = 15;

        crearEscuadrones();

        canvas.start(gameContainer.current); 
        document.getElementById('startButton').style.display = 'none';
        started = true;
    }

    function crearEscuadrones()
    {
        escuadrones = [];
        escuadrones.push(new formacion(new escuadron(2,3,1,false,30), [[1,-1], [0,0], [0,-1], [0,0], [-1,-1]], [40, 40, 140, 40, 60], 0, 200, false));
        escuadrones.push(new formacion(new escuadron(2,3,1,false,30), [[-1,-1], [0,0], [0,-1], [0,0], [1,-1]], [40, 40, 140, 40, 60], 300, 200, false));
        
        escuadrones.push(new formacion(new escuadron(3,1,1,false,20), [[-1,1], [0,0], [-1,0], [0,0], [-1,-1]], [40, 10, 240, 10, 60], 300, 0, false));
        escuadrones.push(new formacion(new escuadron(3,1,1,false,20), [[1,1], [0,0], [1,0], [0,0], [1,-1]], [40, 10, 240, 10, 60], 0, 0, false));

        escuadrones.push(new formacion(new escuadron(5,1,1,false,20), [[1,0]], [400], -100, 100, false));
        escuadrones.push(new formacion(new escuadron(5,1,1,false,20), [[-1,0]], [400], 300, 100, false));
        //Jefe
        escuadrones.push(new formacion(new boss(50), [[0,1], [0,0], [-1,0], [1,0], [-1,0], [0,0], [0,-1]], [100, 200, 100, 200, 100, 200, 100], 110, -80, true));
    }

    function disparar(direction, x, y, isplayer)
    {
        proyectiles.push(new proyectil(2, 2, x, y, "white", direction, isplayer));
    }

    function drawStats()
    {
        for(let i=0; i<player.health; i++) player.drawStatic(5+(i*15), 5, canvas);
    }

    function updateGameArea()
    {
        if(started)
        {
            canvas.clear();
            drawStats();
            let x, y;
            if(arriba == true) y = -1;
            else if(abajo == true) y = 1;
            else y = 0;
            if(izquierda == true) x = -1;
            else if(derecha == true) x = 1;
            else x = 0;

            player.move(x, y, canvas);
            player.update(canvas);
            inviciTempo++;
            if(player.health <= 0) gameOver();
            if(inviciTempo < invincibilidad)
            {
                if(colisionEnemigos(player) == true)
                {
                    player.health--;
                    inviciTempo = 0;
                }
            }

            let escuadronesActivos = 0;
            for(let i=0; i<escuadrones.length; i++)
            {
                if(escuadrones[i].iniciado == true)
                {
                    escuadronesActivos++;
                    escuadrones[i].updateFormacion(canvas);
                }
            }
            
            if(rondas%rondasJefe == 0 && rondas != 0)
            {
                if(escuadrones[escuadrones.length-1].iniciado == false)
                {
                    escuadrones[escuadrones.length-1].iniciarAtaque();
                    rondasJefe = parseInt(rondasJefe*2);
                }
            }
            else
            {
                if(escuadronesActivos < dificultad && dificultad < escuadrones.length-1)
                {
                    let rand = Math.floor(Math.random() * (escuadrones.length-1));
                    let i=0;
                    let e=0;
                    rondas++;
                    while(i < dificultad && e < escuadrones.length-1)
                    {
                        if(escuadrones[rand].iniciado == false)
                        {
                            escuadrones[rand].iniciarAtaque();
                            i++;
                        }
                        else
                        {
                            rand = Math.floor(Math.random() * (escuadrones.length-1));
                            e++;
                        }

                        if(rondas%rondasJefe == 0) break;
                    }
                } 
            }

            if(rondas > dificultad*dificultad*dificultad && rondas >= 4) dificultad++;

            for(let i=0; i<proyectiles.length; i++)
            {
                proyectiles[i].unlimitedMove(proyectiles[i].direction[0]*2, proyectiles[i].direction[1]*2, canvas);
                proyectiles[i].update(canvas);

                //Revisa si alguno impacto
                if(proyectiles[i].y < 0 || proyectiles[i].y > canvas.height || proyectiles[i].x < 0 || proyectiles[i].x > canvas.width || detectarColision(proyectiles[i]))
                {
                    proyectiles.splice(i,1);
                    i--;
                }
            }

            canvas.frameNo++;
            canvas.shot++;

            if(canvas.frameNo >= 50)
            {
                canvas.frameNo=0;
                for(let i=0; i<escuadrones.length; i++)
                {
                    if(escuadrones[i].iniciado == true)
                    {
                        escuadrones[i].escua.disparar(player.x, player.y, disparar);
                    }
                }
            }

            if(pressedKeys.has(' ')) //Espacio
            {
                disparoJugador();
            }
        }
    }

    function detectarColision(pro)
    {
        if(pro.isPlayer == false)
        {
            if(player.colisiona(pro))
            {
                if(inviciTempo > invincibilidad)
                {
                    inviciTempo = 0;
                    return true;
                }
                else
                {
                    player.health++;
                    return true;
                }
            }
        }
        else
        {
            return colisionEnemigos(pro);
        }
    }

    function colisionEnemigos(pro)
    {
        for(let i=0; i<escuadrones.length; i++)
        {
            if(escuadrones[i].iniciado == true)
            {
                for(let j=0; j<escuadrones[i].escua.naves.length; j++)
                {
                    if(escuadrones[i].escua.naves[j].destroyed == false)
                    {
                        if(escuadrones[i].escua.naves[j].colisiona(pro))
                        {
                            if(escuadrones[i].escua.naves[j].destroyed) puntuacion += escuadrones[i].escua.naves[j].puntuacion;
                            return true;
                        }
                    }
                }
            }
        }
    }

    function gameOver()
    {
        started = false;

        setFinalScore(puntuacion);
        setGameOverScreen(true);
    }

    const pressedKeys = new Set();
    function teclasApretadas(event)
    {
        pressedKeys.add(event.key);
        if(event.keyCode === 32) event.preventDefault();
        
        if(pressedKeys.has('ArrowRight') || pressedKeys.has('D'))
        {
            derechaTrue();
        }
        else
        {
            derechaFalse();
        }
        if(pressedKeys.has('ArrowLeft') || pressedKeys.has('A'))
        {
            izquierdaTrue();
        }
        else
        {
            izquierdaFalse();
        }
        if(pressedKeys.has('ArrowDown') || pressedKeys.has('S'))
        {
            abajoTrue();
        }
        else
        {
            abajoFalse();
        }
        if(pressedKeys.has('ArrowUp') || pressedKeys.has('W'))
        {
            arribaTrue();
        }
        else
        {
            arribaFalse();
        }
    }

    function teclasSoltadas(event)
    {
        pressedKeys.delete(event.key);
        if(pressedKeys.has('ArrowRight') || pressedKeys.has('D'))
        {
            derechaTrue();
        }
        else
        {
            derechaFalse();
        }
        if(pressedKeys.has('ArrowLeft') || pressedKeys.has('A'))
        {
            izquierdaTrue();
        }
        else
        {
            izquierdaFalse();
        }
        if(pressedKeys.has('ArrowDown') || pressedKeys.has('S'))
        {
            abajoTrue();
        }
        else
        {
            abajoFalse();
        }
        if(pressedKeys.has('ArrowUp') || pressedKeys.has('W'))
        {
            arribaTrue();
        }
        else
        {
            arribaFalse();
        }
    }

    function disparoJugador()
    {
        if(canvas.shot >= cooldown)
        {
            canvas.shot = 0;
            switch(dificultad)
            {
                case 1:
                    disparar([0,-1], player.x+4, player.y, true);
                    break;
                case 2:
                    disparar([0,-1], player.x+1, player.y, true);
                    disparar([0,-1], player.x+7, player.y, true);
                    break;
                case 3:
                    disparar([-0.3,-1], player.x, player.y, true);
                    disparar([0,-1], player.x+4, player.y, true);
                    disparar([0.3,-1], player.x+8, player.y, true);
                    break;
                case 4:
                    disparar([-0.3,-1], player.x, player.y, true);
                    disparar([0,-1], player.x+1, player.y, true);
                    disparar([0,-1], player.x+7, player.y, true);
                    disparar([0.3,-1], player.x+8, player.y, true);
                    break;
                default:
                    disparar([-0.3,-1], player.x, player.y, true);
                    disparar([0,-1], player.x+1, player.y, true);
                    disparar([0,-1], player.x+7, player.y, true);
                    disparar([0.3,-1], player.x+8, player.y, true);
                    break;
            }
        }
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
            <button onClick={startGame} id="startButton"  className="relative z-10 bg-black text-white font-bold px-6 py-3 rounded border-2 border-white hover:bg-white hover:text-black transition">Jugar</button>
            {gameOverScreen && (<PantallaPerdiste score={finalScore}
                onRestart={() => {
                setGameOverScreen(false);
                window.location.reload();
            }}/>)}
        </div>
    );
}

export default Guerra;