class ExplosiveProjectile extends Sprite{
    constructor(pos, vel, ang, ang_vel, media){
        super(pos, vel, ang, ang_vel, media);
        this.health =  media.gamePlayData !== null ? media.gamePlayData.health : 1;
        this.power = media.gamePlayData.power;
    }
}

class StaticAnimated extends Sprite{

    constructor(pos, vel, ang, ang_vel, media){
        super(pos, vel, ang, ang_vel, media);
        this.isShowing = false;
    }

    draw(canvas, env, factor){
        super.draw(canvas, env, factor);
            return;
            super.draw();
    }
}

class Explosion extends Sprite{
    update(env, factor){
        super.update(env, factor);
    }
}

class SpaceProjectile extends Sprite{
    constructor(pos, vel, ang, ang_vel, media){
        super(pos, vel, ang, ang_vel, media);
        this.health = media.gamePlayData !== null ? media.gamePlayData.health : 1;
    }
}

class Static extends Sprite{
    constructor(pos, vel, ang, ang_vel, media){
        super(pos, vel, ang, ang_vel, media);
        this.isShowing = false;
    }

    draw(canvas, env, orig_size, t){
        let center = env.getCanvasCenter();
        let x_pos = 0;
        let y_pos = 0;
        let x_size = env.getCanvasWidth();
        let y_size = env.getCanvasHeight();
        if(orig_size){
            x_pos = center[0] - this.image_size[0]/2;
            y_pos = center[1] - this.image_size[1]/2;
            x_size = this.image_size[0];
            y_size = this.image_size[1];
        }
        if(t){
            canvas.drawImage(this.image, 0, 0, this.image_size[0], this.image_size[1], t, 0, x_size, y_size);
            canvas.drawImage(this.image, 0, 0, this.image_size[0], this.image_size[1], t - x_size, 0, x_size, y_size);
        }else{
            canvas.drawImage(this.image, 0, 0, this.image_size[0], this.image_size[1], x_pos, y_pos, x_size, y_size);
        }
        return;
        super.draw();
    }
}