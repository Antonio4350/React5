export class objeto
{
    constructor(width, height, x, y, color)
    {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.destroyed = false;
    }

    update(canvas)
    {
        let ctx = canvas.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    drawStatic(x, y, canvas)
    {
        let ctx = canvas.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.width, this.height);
    }

    move(newx, newy, canvas)
    {
        if(newx > 0 && this.x < canvas.width-10) this.x += newx;
        else if(newx < 0 && this.x > 0) this.x += newx;

        if(newy > 0 && this.y < canvas.height-10) this.y += newy;
        else if(newy < 0 && this.y > 0) this.y += newy;
    }

    colisiona(otherobj) 
    {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);

        let colisiona = true;
        if((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            colisiona = false;
        }
        if(colisiona) this.onCollision();
        return colisiona;
    }
    
    onCollision()
    {
        this.destroyed = true;
    }
}

export class proyectil extends objeto
{
    constructor(width, height, x, y, color, direction)
    {
        super(width, height, x, y, color);
        this.direction = direction;
    }
}

export class nave extends objeto
{
    constructor(width, height, x, y, urls, health)
    {
        super(width, height, x, y, "white");
        this.health = health;

        this.imgActual = 0;
        this.imagenes = [];

        for(let i=0; i<urls.length; i++)
        {
            this.imagenes.push(new Image());
            this.imagenes[i].src = urls[i];
            this.imagenes[i].onload = () => {
                this.imgLoaded = true;
            };
        }
    }

    onCollision()
    {
        this.health--;
        if(this.health <= 0) this.destroyed = true;
    }

    updateAnimation()
    {
        if(this.imgActual < this.imagenes.length-1) this.imgActual++;
        else this.imgActual = 0;
    }

    update(canvas)
    {
        let ctx = canvas.context;
        if(this.imgLoaded == true) ctx.drawImage(this.imagenes[this.imgActual], this.x, this.y, this.width, this.height);
    }

    drawStatic(x, y, canvas)
    {
        let ctx = canvas.context;
        if(this.imgLoaded == true)ctx.drawImage(this.imagenes[this.imgActual], x, y, this.width, this.height);
    }
}

export class enemigo extends nave
{
    constructor(width, height, x, y, url, health, bottom, cadencia)
    {
        super(width, height, x, y, url, health, bottom);
        this.bottom = bottom;
        this.cadencia = cadencia;
    }
}