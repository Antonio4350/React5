import { useEffect, useRef } from 'react'; // 1. Importa los hooks necesarios
import { objeto, proyectil, nave, enemigo } from "../objeto"
import { gameArea } from "../canvas";
import './spaceInvaders.css'

function Space() 
{
    // 2. Crea una referencia para el elemento del DOM que contendrá el canvas
    const gameContainer = useRef(null);

    let proyectiles = [];
    let barreras = [];

    let enemigos = [];
    let enemiDirection = 1;
    let moveDown = false;
    let columnasEnemigos = 8;
    let filasEnemigos = 5
    let velocidad = 1;

    let player = new nave(10, 10, 60, 180, ['./space_3.png'], 5, false);
    let canvas = new gameArea(300, 200);
    let interval = null; // Cambiado para que sea nulo al inicio
    let started = false;
    let dirx=0;
    let puntuacion = 0;

    let izquierda = false;
    let derecha = false;

    // 3. Usa useEffect para manejar la lógica del juego
    useEffect(() => {
        // Asigna los event listeners aquí para que se configuren al montar el componente
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
            // 4. Se asegura de que el canvas exista antes de intentar removerlo
            if (canvas.canvas) {
                canvas.canvas.remove();
            }
            clearInterval(interval);
            interval = setInterval(updateGameArea, 20);
        }
        catch (e) {
            console.error("Error al reiniciar el juego:", e);
        }
        
        proyectiles = [];
        barreras = [];
        enemigos = [];
        enemiDirection = 1;
        moveDown = false;
        columnasEnemigos = 8;
        filasEnemigos = 5
        velocidad = 1;

        player = new nave(10, 10, 60, 180, ['./space_3.png'], 5, false);
        canvas = new gameArea(300, 200);

        dirx=0;
        puntuacion = 0;

        // 5. Llama a canvas.start() y le pasa la referencia del contenedor
        // Esto asegura que el canvas se cree dentro del div de React
        canvas.start(gameContainer.current); 
        document.getElementById('startButton').style.display = 'none';

        for(let i=0; i<filasEnemigos; i++)
        {
            for(let j=0; j<columnasEnemigos; j++)
            {
                if(i==0) enemigos.push(new enemigo(10, 10, 20+(20*j), 20+(15*i), ['./space_2a.png', './space_2b.png', './space_2c.png'], 2, (i==filasEnemigos-1), 5));
                else if(i==2) enemigos.push(new enemigo(10, 10, 20+(20*j), 20+(15*i), ['./space_1a.png', './space_1b.png', './space_1c.png'], 1, (i==filasEnemigos-1), 2));
                else enemigos.push(new enemigo(10, 10, 20+(20*j), 20+(15*i), ['./space_0a.png', './space_0b.png', './space_0c.png'], 1, (i==filasEnemigos-1), 5));
                
            }
        }

        crearBarrera(10);
        crearBarrera(80);
        crearBarrera(160);
        crearBarrera(240);

        started = true;
    }

    function crearBarrera(x)
    {
        for(let j=0; j<5; j++)
        {
            for(let i=0; i<20; i++)
            {
                if(i<1 || i>18) barreras.push(new objeto(2, 2, x+(i*2), 160+(j*2), "green"));
                if(i==1 || i==18) barreras.push(new objeto(2, 2, x+(i*2), 160+(j*2)-2, "green"));
                if(i>1 && i<18) barreras.push(new objeto(2, 2, x+(i*2), 160+(j*2)-4, "green"));
            }
        }
    }

    function disparar(direction, x, y)
    {
        proyectiles.push(new proyectil(2, 5, x, y, "white", direction));
    }

    function detectarColision(pro)
    {
        for(let i=0; i<barreras.length; i++) if(barreras[i].colisiona(pro)) return true;

        if(pro.direction == 1)
        {
            if(player.colisiona(pro)) return true;
        }
        else
        {
            for(let i=0; i<enemigos.length; i++)
            {
                if(enemigos[i].destroyed == false)
                {
                    if(enemigos[i].colisiona(pro))
                    {
                        puntuacion+=30;
                        return true;
                    }
                }
            }
        }
    }

    function reorganizarEnemigos()
    {
        for(let i=enemigos.length-1; i>=0; i--)
        {
            if(enemigos[i].destroyed == true && enemigos[i].bottom == true)
            {
                try
                {
                    enemigos[i-columnasEnemigos].bottom = true;
                }
                catch
                {
                    
                }
            }
        }
    }

    function disparoEnemigos()
    {
        reorganizarEnemigos();
        for(let i=0; i<enemigos.length; i++)
        {
            if(enemigos[i].destroyed == false && enemigos[i].bottom == true && Math.floor(Math.random() * enemigos[i].cadencia) == 0)
            {
                disparar(1, enemigos[i].x+4, enemigos[i].y-2);
            }
        }
    }

    function drawStats()
    {
        for(let i=0; i<player.health; i++) player.drawStatic(5+(i*15), 5, canvas);
    }

    function gameOver()
    {
        started = false;
        if(puntuacion == enemigos.length*30 && player.health > 0)
        {
            puntuacion *= 1.5*player.health;
        }
        //esto aparece cuando perder, agragar todo lo que quiera mostrar a la hora de perder
        document.getElementById('puntaje').innerHTML = puntuacion;
        document.getElementById('startButton').style.display = 'block';

    }

    function updateGameArea()
    {
        if(started)
        {
            canvas.clear();
            drawStats();
            if(derecha == true) player.move(1, 0, canvas);
            else if(izquierda == true) player.move(-1, 0, canvas);
            player.update(canvas);

            if(player.destroyed == true) gameOver();

            //Actualiza los proyectiles
            for(let i=0; i<proyectiles.length; i++)
            {
                proyectiles[i].move(0, proyectiles[i].direction*2, canvas);
                proyectiles[i].update(canvas);

                //Revisa si alguno impacto
                if(proyectiles[i].y < 5 || proyectiles[i].y > canvas.height-15 || detectarColision(proyectiles[i]))
                {
                    proyectiles.splice(i,1);
                    i--;
                }
            }

            //Actualiza la direccion de los enemigos
            for(let i=0; i<enemigos.length; i++)
            {
                if(enemigos[i].destroyed == false)
                {
                    if(enemigos[i].x >= canvas.width-20 && enemiDirection == 1)
                    {
                        enemiDirection = -1;
                        moveDown = true;
                    }
                    if(enemigos[i].x <= 10 && enemiDirection == -1)
                    {
                        enemiDirection = 1;
                        moveDown = true;
                    }
                    if(enemigos[i].y > 140) gameOver();
                }
            }

            //Aumenta en uno los relojes
            canvas.frameNo++;
            canvas.shot++;
            //Si paso mas de 20 frames mueve a los enemigos
            if(canvas.frameNo >= 20)
            {
                canvas.frameNo = 0;
                for(let i=0; i<enemigos.length; i++)
                {
                    if(enemigos[i].destroyed == false)
                    {
                        if(moveDown) enemigos[i].move(enemiDirection*velocidad, 10, canvas);
                        else enemigos[i].move(enemiDirection*velocidad, 0, canvas);

                        enemigos[i].updateAnimation();
                    }
                }
                moveDown = false;
                disparoEnemigos();
            }

            //Revisa a que enemigos actualizar en pantalla
            let restantes = 0;
            for(let i=0; i<enemigos.length; i++)
            {             
                if(enemigos[i].destroyed == false)
                {
                    enemigos[i].update(canvas);
                    restantes++;
                }
            }
            if(restantes == 0) gameOver();
            else velocidad = parseInt((enemigos.length / restantes)*5);
            if(velocidad > 15) velocidad = 15;

            //Renderiza y actualiza las barreras
            for(let i=0; i<barreras.length; i++)
            {
                barreras[i].update(canvas);
                if(barreras[i].destroyed == true)
                {
                    barreras.splice(i,1);
                    i--;
                }
            }
        }
    }

    function teclasApretadas(event)
    {
        if(event.keyCode === 32) event.preventDefault();
        
        if(event.keyCode === 32) //Espacio
        {
            disparoJugador();
        }
        if(event.keyCode === 39 || event.keyCode === 68) //Derecha
        {
            derechaTrue();
        }
        if(event.keyCode === 37 || event.keyCode === 65) //Izquierda
        {
            izquierdaTrue();
        }
        
    }

    function teclasSoltadas(event)
    {
        if(event.keyCode === 39 || event.keyCode === 68) //Derecha
        {
            derechaFalse();
        }
        if(event.keyCode === 37 || event.keyCode === 65) //Izquierda
        {
            izquierdaFalse();
        }
    }

    function disparoJugador()
    {
        if(canvas.shot >= 20)
        {
            canvas.shot = 0;
            disparar(-1, player.x+4, player.y+2);
        }
    }

    function derechaTrue()
    {
        derecha = true;
    }

    function derechaFalse()
    {
        derecha = false;
    }

    function izquierdaTrue()
    {
        izquierda = true;
    }

    function izquierdaFalse()
    {
        izquierda = false;
    }

    return (
        // 6. Asigna la referencia `gameContainer` al div que contendrá el canvas
        <div ref={gameContainer} className="relative w-full h-full flex flex-col items-center"> 
            <button onClick={startGame} id="startButton"  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ">Jugar</button>

            <div className="flex gap-4 sm:hidden mb-4 ">
                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg" onTouchStart={izquierdaTrue} onTouchEnd={izquierdaFalse}>Izquierda</button>
                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg" onTouchStart={derechaTrue} onTouchEnd={derechaFalse}>Derecha</button>
                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg" onClick={disparoJugador}>Disparar</button>
            </div>

            <p id="puntaje" className="text-white text-lg"></p>
        </div>
    )
}

export default Space