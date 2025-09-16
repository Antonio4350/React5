import { objeto, proyectil, nave, enemigo } from "../objeto"

export class escuadron
{
    constructor(filas, columnas, health, especial, puntuacion)
    {
        if(especial == false)
        {
            this.naves = [];
            this.filas = filas;
            this.columnas = columnas;
            this.health = health;

            for(let i=0; i<filas; i++)
            {
                for(let j=0; j<columnas; j++)
                {
                    this.naves.push(new enemigo(10, 10, (20*j), (15*i), ['./space_0a.png', './space_0b.png', './space_0c.png'], health, false, 5, puntuacion));
                }
            }
        }
    }

    resetNaves()
    {
        for(let i=0; i<this.naves.length; i++)
        {
            this.naves[i].health = this.health;
            this.naves[i].destroyed = false;
        }
    }

    setPosition(x,y)
    {
        let cont = 0;
        for(let i=0; i<this.filas; i++)
        {
            for(let j=0; j<this.columnas; j++)
            {
                this.naves[cont].x = x + i*20;
                this.naves[cont].y = y + j*20;
                cont++;
            }
        }
    }

    moveEscuadron(x, y, canvas)
    {
        for(let i=0; i<this.naves.length; i++)
        {
            this.naves[i].unlimitedMove(x, y);
            if(this.naves[i].destroyed == false) this.naves[i].update(canvas);
        }
    }

    disparar(obX, obY, disparar)
    {
        for(let i=0; i<this.naves.length; i++)
        {
            if(this.naves[i].destroyed == false)
            {
                let dir = [this.naves[i].x - obX, this.naves[i].y - obY];
                let magnitude = -Math.sqrt(dir[0]*dir[0] + dir[1]*dir[1]);
                let normaliced = [dir[0]/magnitude, dir[1]/magnitude];
                disparar(normaliced, this.naves[i].x, this.naves[i].y, false);
            }
        }
    }

    allDestroyed()
    {
        for(let i=0; i<this.naves.length; i++)
        {
            if(this.naves[i].destroyed == false) return false;
        }
        return true;
    }
}

export class boss extends escuadron
{
    constructor(health)
    {
        super(0,0, health, true);
        this.health = health;
        this.naves = [];
        this.width = 80;
        this.height = 80;

        this.naves.push(new enemigo(this.width, this.height, 0, 0, ['./boss.png'], health, false, 5, 500));
    }

    disparar(obX, obY, disparar)
    {
        let n=20;
        let speed=0.5;
        let aumentar = true;
        for(let i=0; i<n; i++)
        {
            let angle = (i / n) * (2 * Math.PI);
            let dx = Math.cos(angle) * speed;
            let dy = Math.sin(angle) * speed;
            disparar([dx, dy], this.naves[0].x + (this.width/2), this.naves[0].y + (this.height/2), false);
        }
    }

    setPosition(x,y)
    {
        this.naves[0].x = x;
        this.naves[0].y = y;
    }
}

export class formacion
{
    constructor(escua, direcciones, cooldown, x, y, bucle)
    {
        this.escua = escua;
        this.dirActual = 0;
        this.direcciones = direcciones;
        this.tiempoActual = 0;
        this.cooldown = cooldown;
        this.iniciado = false;
        this.x = x;
        this.y = y;
        this.bucle = bucle;
    }

    iniciarAtaque()
    {
        this.iniciado = true;
        this.dirActual = 0;
        this.tiempoActual = 0;
        this.escua.resetNaves();
        this.escua.setPosition(this.x,this.y);
    }

    updateFormacion(canvas)
    {
        this.tiempoActual++;
        if(this.tiempoActual > this.cooldown[this.dirActual])
        {
            if(this.dirActual < this.direcciones.length-1 && this.escua.allDestroyed() == false) this.dirActual++;
            else
            {
                if(this.bucle == true && this.escua.allDestroyed() == false)
                {
                    this.dirActual = 0;
                    this.tiempoActual = 0;
                    this.escua.setPosition(this.x,this.y);
                }
                else this.iniciado = false;
            }
            this.tiempoActual = 0;
        }

        this.escua.moveEscuadron(this.direcciones[this.dirActual][0], this.direcciones[this.dirActual][1], canvas);
    }
}