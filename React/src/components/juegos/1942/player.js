import { objeto, proyectil, nave, enemigo } from "../objeto"

export class jugador
{
    constructor(health, x, y, sprite)
    {
        this.nave = new nave(10, 10, x, y, [sprite], health, false);
        this.derecha = false;
        this.izquierda = false;
        this.arriba = false;
        this.abajo = false;
        this.inviciTempo = 0;
        this.shootTime = 0;
    }

    updatePlayer(canvas)
    {
        let x, y;
        if(this.arriba == true) y = -1;
        else if(this.abajo == true) y = 1;
        else y = 0;
        if(this.izquierda == true) x = -1;
        else if(this.derecha == true) x = 1;
        else x = 0;

        this.nave.move(x, y, canvas);
        this.nave.update(canvas);
        this.inviciTempo++;
        this.shootTime++;
    }
}