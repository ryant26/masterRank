export const addHeroesToServerAsync = (heroNames, socket) => {

    return () => {
        heroNames.forEach((heroName, i) => {
            socket.addHero(heroName, (i+1));
        });
    };
};