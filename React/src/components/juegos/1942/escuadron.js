import { objeto, proyectil, nave, enemigo } from "../objeto"

export class escuadron
{
    constructor(naves, direcciones, cooldown)
    {
        this.naves = naves;
        this.dirActual = 0;
        this.direcciones = direcciones;
        this.tiempoActual = 0;
        this.cooldown = cooldown;
        this.terminado = false;
    }

    iniciarAtaque()
    {
        this.terminado = false;
        this.dirActual = 0;
        this.tiempoActual = 0;
    }

    updateEscuadron(canvas)
    {
        this.tiempoActual++;
        if(this.tiempoActual > this.cooldown[this.dirActual])
        {
            if(this.dirActual < this.direcciones.length-1) this.dirActual++;
            else this.terminado = true;
            this.tiempoActual = 0;
        }

        for(let i=0; i<this.naves.length; i++)
        {
            this.naves[i].unlimitedMove(this.direcciones[this.dirActual][0], this.direcciones[this.dirActual][1]);
            if(this.naves[i].destroyed == false) this.naves[i].update(canvas);
        }
    }
}