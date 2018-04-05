
function init_main(resources){
    console.log(resources);
    let spriteFactory = createSpriteFactory();
    let game = init_game(resources, spriteFactory);
    console.dir(game);
    let environment = init_environment(game);
    
}