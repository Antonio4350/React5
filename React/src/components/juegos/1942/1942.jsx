import './1942.css'
import { objeto, proyectil, nave, enemigo } from "../objeto"
import { Link } from 'react-router-dom';
import { jugador } from './player';
import { escuadron, boss, formacion } from './escuadron';
import { gameArea } from "../canvas";
import { useEffect, useRef } from 'react';
import { useState } from "react";
import PantallaPerdiste from '../../pantallaPerdiste';
import CONFIG from '../../../config';

function Guerra() 
{
    const gameContainer = useRef(null);
    const [gameOverScreen, setGameOverScreen] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    let player;
    let player2 = null;
    let players = 1;
    let canvas = new gameArea(300, 200);
    let interval = null;
    let started = false;

    let proyectiles = [];
    let puntuacion = 0;
    let cooldown = 15;
    let invincibilidad = 40;

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

        if(players == 1)
        {
            player = new jugador(10, 145, 95, './space_3.png');
        }
        if(players == 2)
        {
            player = new jugador(10, 130, 95, './space_3.png');
            player2 = new jugador(10, 160, 95, './space_3.png');
        }
        canvas = new gameArea(300, 200);
        proyectiles = [];
        cooldown = 15;

        crearEscuadrones();

        canvas.start(gameContainer.current, 'warCanvas'); 
        document.getElementById('startButton1').style.display = 'none';
        document.getElementById('startButton2').style.display = 'none';
        started = true;
    }

    function crearEscuadrones()
    {
        escuadrones = [];
        escuadrones.push(new formacion(new escuadron(2,3,1,false,30,0), [[1,-1], [0,0], [0,-1], [0,0], [-1,-1]], [40, 40, 140, 40, 60], 0, 200, false));
        escuadrones.push(new formacion(new escuadron(2,3,1,false,30,0), [[-1,-1], [0,0], [0,-1], [0,0], [1,-1]], [40, 40, 140, 40, 60], 300, 200, false));
        
        escuadrones.push(new formacion(new escuadron(3,1,1,false,20,1), [[-1,1], [0,0], [-1,0], [0,0], [-1,-1]], [40, 10, 240, 10, 60], 300, 0, false));
        escuadrones.push(new formacion(new escuadron(3,1,1,false,20,1), [[1,1], [0,0], [1,0], [0,0], [1,-1]], [40, 10, 240, 10, 60], 0, 0, false));

        escuadrones.push(new formacion(new escuadron(5,1,1,false,20,2), [[1,0]], [400], -100, 100, false));
        escuadrones.push(new formacion(new escuadron(5,1,1,false,20,2), [[-1,0]], [400], 300, 100, false));
        //Jefe
        escuadrones.push(new formacion(new boss(50), [[0,1], [0,0], [-1,0], [1,0], [-1,0], [0,0], [0,-1]], [100, 200, 100, 200, 100, 200, 100], 110, -80, true));
    }

    function disparar(direction, x, y, isplayer)
    {
        proyectiles.push(new proyectil(2, 2, x, y, "white", direction, isplayer));
    }

    function drawStats()
    {
        for(let i=0; i<player.nave.health; i++) player.nave.drawStatic(5+(i*15), 5, canvas);
        if(player2 != null) for(let i=0; i<player2.nave.health; i++) player2.nave.drawStatic(5+(i*15), 15, canvas);
    }

    function updateGameArea()
    {
        if(started)
        {
            canvas.clear();
            drawStats();

            if(player.nave.health > 0) player.updatePlayer(canvas);
            if(player2 != null) if(player2.nave.health > 0) player2.updatePlayer(canvas);

            if(players == 1)
            {
                if(player.nave.health <= 0) gameOver();
            }
            else
            {
                if(player.nave.health <= 0 && player2.nave.health <= 0) gameOver();
            }

            if(player.inviciTempo < invincibilidad && player.nave.health > 0)
            {
                if(colisionEnemigos(player.nave) == true)
                {
                    player.nave.health--;
                    player.inviciTempo = 0;
                }
            }
            if(player2 != null)
            {
                if(player2.inviciTempo < invincibilidad && player2.nave.health > 0)
                {
                    if(colisionEnemigos(player2.nave) == true)
                    {
                        player2.nave.health--;
                        player2.inviciTempo = 0;
                    }
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
            if(canvas.frameNo == 20)
            {
                for(let i=0; i<escuadrones.length; i++)
                {
                    if(escuadrones[i].iniciado == true) escuadrones[i].escua.updateAnimations();
                }
            }

            if(canvas.frameNo >= 50)
            {
                canvas.frameNo=0;
                for(let i=0; i<escuadrones.length; i++)
                {
                    if(escuadrones[i].iniciado == true)
                    {
                        if(players == 1) escuadrones[i].escua.disparar(player.nave.x, player.nave.y, disparar);
                        else
                        {
                            let rand = Math.floor(Math.random() * 2);
                            if(rand == 0 && player.nave.health > 0) escuadrones[i].escua.disparar(player.nave.x, player.nave.y, disparar);
                            else if(player2.nave.health > 0) escuadrones[i].escua.disparar(player2.nave.x, player2.nave.y, disparar);
                            else escuadrones[i].escua.disparar(player.nave.x, player.nave.y, disparar);
                        }
                    }
                }
            }

            if(pressedKeys.has('Enter') && player.nave.health > 0)
            {
                disparoJugador(1);
            }
            if(players == 2 && pressedKeys.has(' '))
            {
                if(player2.nave.health > 0) disparoJugador(2);
            }
        }
    }

    function detectarColision(pro)
    {
        if(pro.isPlayer == false)
        {
            if(player.nave.colisiona(pro) && player.nave.health > 0)
            {
                if(player.inviciTempo > invincibilidad)
                {
                    player.inviciTempo = 0;
                    return true;
                }
                else
                {
                    player.nave.health++;
                    return true;
                }
            }
            else if(player2 != null) if(player2.nave.colisiona(pro) && player2.nave.health > 0)
            {
                if(player2.inviciTempo > invincibilidad)
                {
                    player2.inviciTempo = 0;
                    return true;
                }
                else
                {
                    player2.nave.health++;
                    return true;
                }
            }
            else return false;
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

        if(players == 1)
        {
            const idUsuario = localStorage.getItem("jugador1_id");
        
            // Envía el score al backend
            fetch(`${CONFIG.API_URL}/guerra`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idusuario: idUsuario, puntuacion: puntuacion })
            })
            .then(res => res.json())
            .then(data => console.log("Score guardado:", data))
            .catch(err => console.error(err));
        }
        else
        {
            const idUsuario = localStorage.getItem("jugador1_id");
            const idUsuario2 = localStorage.getItem("jugador2_id");
            // Envía el score al backend
            fetch(`${CONFIG.API_URL}/guerramultijugador`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idusuario: idUsuario,idsocio: idUsuario2, puntuacion: puntuacion })
            })
            .then(res => res.json())
            .then(data => console.log("Score guardado:", data))
            .catch(err => console.error(err));
        }
    }

    const pressedKeys = new Set();
    function teclasApretadas(event)
    {
        pressedKeys.add(event.key);
        if(event.keyCode === 32) event.preventDefault();
        teclas();
    }

    function teclasSoltadas(event)
    {
        pressedKeys.delete(event.key);
        teclas();
    }

    function teclas()
    {
        if(started)
        {
            if(pressedKeys.has('ArrowRight'))
            {
                player.derecha = true;
            }
            else
            {
                player.derecha = false;
            }
            if(pressedKeys.has('ArrowLeft'))
            {
                player.izquierda = true;
            }
            else
            {
                player.izquierda = false;
            }
            if(pressedKeys.has('ArrowDown'))
            {
                player.abajo = true;
            }
            else
            {
                player.abajo = false;
            }
            if(pressedKeys.has('ArrowUp'))
            {
                player.arriba = true;
            }
            else
            {
                player.arriba = false;
            }

            if(players == 2)
            {
                if(pressedKeys.has('d') || pressedKeys.has('D'))
                {
                    player2.derecha = true;
                }
                else
                {
                    player2.derecha = false;
                }
                if(pressedKeys.has('a') || pressedKeys.has('A'))
                {
                    player2.izquierda = true;
                }
                else
                {
                    player2.izquierda = false;
                }
                if(pressedKeys.has('s') || pressedKeys.has('S'))
                {
                    player2.abajo = true;
                }
                else
                {
                    player2.abajo = false;
                }
                if(pressedKeys.has('w') || pressedKeys.has('W'))
                {
                    player2.arriba = true;
                }
                else
                {
                    player2.arriba = false;
                }
            }
        }
    }

    function disparoJugador(p)
    {
        if(p == 1)
        {
            if(player.shootTime >= cooldown)
            {
                player.shootTime = 0;
                switch(dificultad)
                {
                    case 1:
                        disparar([0,-1], player.nave.x+4, player.nave.y, true);
                        break;
                    case 2:
                        disparar([0,-1], player.nave.x+1, player.nave.y, true);
                        disparar([0,-1], player.nave.x+7, player.nave.y, true);
                        break;
                    case 3:
                        disparar([-0.3,-1], player.nave.x, player.nave.y, true);
                        disparar([0,-1], player.nave.x+4, player.nave.y, true);
                        disparar([0.3,-1], player.nave.x+8, player.nave.y, true);
                        break;
                    case 4:
                        disparar([-0.3,-1], player.nave.x, player.nave.y, true);
                        disparar([0,-1], player.nave.x+1, player.nave.y, true);
                        disparar([0,-1], player.nave.x+7, player.nave.y, true);
                        disparar([0.3,-1], player.nave.x+8, player.nave.y, true);
                        break;
                    default:
                        disparar([-0.3,-1], player.nave.x, player.nave.y, true);
                        disparar([0,-1], player.nave.x+1, player.nave.y, true);
                        disparar([0,-1], player.nave.x+7, player.nave.y, true);
                        disparar([0.3,-1], player.nave.x+8, player.nave.y, true);
                        break;
                }
            }
        }
        else if(p == 2)
        {
            if(player2.shootTime >= cooldown)
            {
                player2.shootTime = 0;
                switch(dificultad)
                {
                    case 1:
                        disparar([0,-1], player2.nave.x+4, player2.nave.y, true);
                        break;
                    case 2:
                        disparar([0,-1], player2.nave.x+1, player2.nave.y, true);
                        disparar([0,-1], player2.nave.x+7, player2.nave.y, true);
                        break;
                    case 3:
                        disparar([-0.3,-1], player2.nave.x, player2.nave.y, true);
                        disparar([0,-1], player2.nave.x+4, player2.nave.y, true);
                        disparar([0.3,-1], player2.nave.x+8, player2.nave.y, true);
                        break;
                    case 4:
                        disparar([-0.3,-1], player2.nave.x, player2.nave.y, true);
                        disparar([0,-1], player2.nave.x+1, player2.nave.y, true);
                        disparar([0,-1], player2.nave.x+7, player2.nave.y, true);
                        disparar([0.3,-1], player2.nave.x+8, player2.nave.y, true);
                        break;
                    default:
                        disparar([-0.3,-1], player2.nave.x, player2.nave.y, true);
                        disparar([0,-1], player2.nave.x+1, player2.nave.y, true);
                        disparar([0,-1], player2.nave.x+7, player2.nave.y, true);
                        disparar([0.3,-1], player2.nave.x+8, player2.nave.y, true);
                        break;
                }
            }
        }
    }

    function setPlayer(n)
    {
        players = n;
    }

    if(localStorage.getItem('jugador1_id') != null)
    {
        return (  
            <div ref={gameContainer} className="relative w-full h-full flex flex-row items-center gap-10"> 
                <button onClick={() => { setPlayer(1); startGame(); }} id="startButton1"  className="relative z-10 bg-black text-white font-bold px-12 py-3 rounded border-2 border-white hover:bg-white hover:text-black transition">1 Jugador</button>
                {
                    localStorage.getItem('jugador2_id') != null ? (<button onClick={() => { setPlayer(2); startGame(); }} id="startButton2" className="relative z-10 bg-black text-white font-bold px-10 py-3 rounded border-2 border-white hover:bg-white hover:text-black transition">2 Jugadores</button>)
                    : (
                    <button onClick={() => { window.location.href = "/"; }} id="startButton2" className="relative z-10 bg-black text-white font-bold px-10 py-3 rounded border-2 border-white hover:bg-white hover:text-black transition">Agregar Jugador</button>)
                }
                {gameOverScreen && (<PantallaPerdiste score={finalScore}
                    onRestart={() => {
                    setGameOverScreen(false);
                    window.location.reload();
                }}/>)}
            </div>
        );
    }
    else
    {
        return (
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="bg-black/80 border-4 border-white p-8  text-center shadow-lg animate-scaleIn">
                    <h3 className="text-2xl font-bold text-white mb-6 tracking-widest retro-text">No es posible jugar sin iniciar sesion</h3>
                    <h3 className="text-xl text-white mb-2"><Link to="/">Iniciar Sesión Aqui</Link></h3>
                </div>
            </div>
        );
    }
}

export default Guerra;