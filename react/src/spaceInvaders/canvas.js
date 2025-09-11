export class gameArea
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
    }

    start(container) // Acepta un contenedor como argumento
    {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext("2d");
        container.appendChild(this.canvas); // Agrega el canvas al contenedor
        this.frameNo = 0;
        this.shot = 10;
    }

    clear()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}