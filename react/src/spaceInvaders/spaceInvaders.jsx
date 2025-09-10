import { objeto, proyectil, nave, enemigo } from "./objeto"
import { gameArea } from "./Canvas";
import './spaceInvaders.css'

function Space() 
{
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
    let interval = setInterval(updateGameArea, 20); //Reloj interno
    let started = false;
    let dirx=0;
    let puntuacion = 0;

    document.addEventListener('keydown', teclasApretadas);
    document.addEventListener('keyup', teclasSoltadas);

    function startGame()
    {
        canvas.start();
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
        console.log(puntuacion);
    }

    function gameOver()
    {
        started = false;
        if(puntuacion == enemigos.length*30 && player.health > 0)
        {
            puntuacion *= 1.5*player.health;
        }
        document.getElementById('puntaje').innerHTML = puntuacion;
    }

    function updateGameArea()
    {
        if(started)
        {
            canvas.clear();
            drawStats();
            player.move(dirx, 0, canvas);
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
                    if(enemigos[i].y > 150) gameOver();
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
        if(event.keyCode === 32 && canvas.shot >= 20) //Espacio
        {
            canvas.shot = 0;
            disparar(-1, player.x+4, player.y+2);
        }
        else if(event.keyCode === 39 || event.keyCode === 68) //Derecha
        {
            dirx = 1;
        }
        else if(event.keyCode === 37 || event.keyCode === 65) //Izquierda
        {
            dirx = -1;
        }
    }

    function teclasSoltadas(event)
    {
        if(event.keyCode === 39 || event.keyCode === 68 || event.keyCode === 37 || event.keyCode === 65) //Derecha
        {
            dirx=0;
        }
    }

    return (
        <div>
            <button onClick={startGame} id="startButton">Start</button>
            <button className="botonResponsive">Izquierda</button>
            <button className="botonResponsive">Derecha</button>
            <button className="botonResponsive">Disparar</button>
            <p id="puntaje"></p>
        </div>
    )
}

export default Space
