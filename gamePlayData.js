    class ShipData{
        constructor(name, projectileType = null, health = 1, power = 1){
            this.name = name;
            this.health = health;
            this.power = power;
            this.projectileType = projectileType;
        };
    }

    class EnemyShipData{
        constructor(name, projectileType = null, health = 1, power = 1){
            this.name = name;
            this.health = health;
            this.power = power;
            this.projectileType = projectileType;
        };
    }

    class ExplosiveProjectileData{
        constructor(name, power = 1, spawns = false){
            this.name = name;
            this.power = power;
            this.spawns = spawns;
        };
    }

    class SpaceProjectileData{
        constructor(name, health = 1){
            this.name = name;
            this.health = health;
            this.spawns = spawns;
        };
    }

    class GamePlayData{
        constructor(){
            this.ships = [];
            this.explosiveProjectile = [];
            this.spaceProjectile = [];
            this.enemyShips = [];
        }

        addShipData(data){
            this.ships.push(data);
        }

        addEnemyShipData(data){
            this.ships.push(data);
        }

        addExplosiveProjectileData(data){
            this.explosiveProjectile.push(data);
        }

        addSpaceProjectileData(data){
            this.spaceProjectile.push(data);
        }

        getData(data, name){
            let el;
            let len = this.data.length;
            for(let i = 0; i < len; i++){
                if(this.data[i].name === name){
                    return data[i];
                }
            }
            return null;
        }

        getShipData(name){
            return this.getData(this.ships, name);
        }

        getEnemyShipData(name){
            return this.getData(this.enemyShips, name);
        }

        getExplosiveProjectileData(name){
            return this.getData(this.explosiveProjectile, name);
        }

        getSpaceProjectileData(name){
            return this.getData(this.spaceProjectile, name);
        }
    }