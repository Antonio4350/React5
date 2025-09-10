export class gameArea
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
    }

    start()
    {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.shot = 10;
    }

    clear()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}