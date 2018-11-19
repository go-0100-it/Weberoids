function createSpriteFactory(){

    function createExplosiveProjectile(pos, vel, ang, ang_vel, media){
        return new ExplosiveProjectile(pos, vel, ang, ang_vel, media);
    }

    function createShip(pos, vel, ang, ang_vel, media){
        return new Ship(pos, vel, ang, ang_vel, media);
    }

    function createExplosion(pos, vel, ang, ang_vel, media){
        return new Explosion(pos, vel, ang, ang_vel, media);
    }

    function createSpaceProjectile(pos, vel, ang, ang_vel, media, health){
        return new SpaceProjectile(pos, vel, ang, ang_vel, media, health);
    }

    function createBonusProjectile(pos, vel, ang, ang_vel, media, health){
        return new BonusProjectile(pos, vel, ang, ang_vel, media, health);
    }

    function createBackgroundProjectile(pos, vel, ang, ang_vel, media){
        return new BackgroundProjectile(pos, vel, ang, ang_vel, media);
    }

    function createStatic(pos, vel, ang, ang_vel, media){
        return new Static(pos, [0, 0], 0, 0, media);
    }

    function createStaticAnimated(pos, vel, ang, ang_vel, media){
        return new StaticAnimated(pos, vel, ang, ang_vel, media);
    }

    return {
        createExplosiveProjectile: createExplosiveProjectile,
        createShip: createShip,
        createExplosion: createExplosion,
        createSpaceProjectile: createSpaceProjectile,
        createBonusProjectile: createBonusProjectile,
        createBackgroundProjectile: createBackgroundProjectile,
        createStatic: createStatic,
        createStaticAnimated: createStaticAnimated
    };
}
