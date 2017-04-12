var Pente = function(tableau, nbtour, player, started) {
    this.tableau = tableau;
    this.nbtour = nbtour;
    this.player = player;
    this.started = started;
};

Pente.prototype.autorise = function(x, y) {
    if (this.tableau[x][y] == 0) {
        if (this.started && this.turn == 2) {
            var interdit = [6, 7, 8, 9, 10, 11];
            console.log(this.turn);
            console.log(interdit.indexOf(x));
            console.log(interdit.indexOf(y));
            if (interdit.indexOf(x) == 1 && interdit.indexOf(y)) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }

}

Pente.prototype.coup = function(x, y) {
    console.log(this.player.numerojoueur);
    this.tableau[x][y] = this.player.numerojoueur;
    return this.tableau[x][y];
}

Pente.prototype.tenaille = function(x, y) {
    var enemievalue = (this.player.numerojoueur == 1 ? 2 : 1);
    var result = { 
        "tableau" : this.tableau,
        "tenaille": false 
    };
    console.log('En: '+ enemievalue);
    console.log(this.tableau[x]);
    console.log(this.tableau[x][y+1]);
    console.log(this.tableau[x][y+2]);
    console.log(this.tableau[x][y+3]);

    if (this.tableau[x-1] != undefined && this.tableau[x-2] != undefined && this.tableau[x-3] != undefined && this.tableau[x-1][y] == enemievalue && this.tableau[x-2][y] == enemievalue && this.tableau[x-3][y] == this.player.numjoueur) {
        this.tableau[x-1][y] = 0;
        this.tableau[x-2][y] = 0;
        result.tenaille = true;
    } else if (this.tableau[x+1] != undefined && this.tableau[x+2] != undefined && this.tableau[x+3] != undefined && this.tableau[x+1][y] == enemievalue && this.tableau[x+2][y] == enemievalue && this.tableau[x+3][y] == this.player.numjoueur) {
        this.tableau[x+1][y] = 0;
        this.tableau[x+2][y] = 0;
        result.tenaille = true;
    } else if (this.tableau[x][y+1] != undefined && this.tableau[x][y+2] != undefined && this.tableau[x][y+3] != undefined && this.tableau[x][y+1] == enemievalue && this.tableau[x][y+2] == enemievalue && this.tableau[x][y+3] == this.player.numjoueur) {
        console.log('Tenaille');
        this.tableau[x+1][y] = 0;
        this.tableau[x+2][y] = 0;
        result.tenaille = true;
    } else if (this.tableau[x][y-1] != undefined && this.tableau[x][y-2] != undefined && this.tableau[x][y-3] != undefined && this.tableau[x][y-1] == enemievalue && this.tableau[x][y-2] == enemievalue && this.tableau[x][y-3] == this.player.numjoueur) {
        this.tableau[x][y-1] = 0;
        this.tableau[x][y-2] = 0;
        result.tenaille = true;
    } else if (this.tableau[x-1] != undefined && this.tableau[x-2] != undefined && this.tableau[x-3] != undefined && this.tableau[x-1][y+1] == enemievalue && this.tableau[x-2][y+2] == enemievalue && this.tableau[x-3][y+3] == this.player.numjoueur) {
        this.tableau[x-1][y+1] = 0;
        this.tableau[x-2][y+2] = 0;
        result.tenaille = true;
    } else if (this.tableau[x-1] != undefined && this.tableau[x-2] != undefined && this.tableau[x-3] != undefined && this.tableau[x-1][y-1] == enemievalue && this.tableau[x-2][y-2] == enemievalue && this.tableau[x-3][y-3] == this.player.numjoueur) {
        this.tableau[x-1][y-1] = 0;
        this.tableau[x-2][y-2] = 0;
        result.tenaille = true;
    } else if (this.tableau[x+1] != undefined && this.tableau[x+2] != undefined && this.tableau[x-3] != undefined && this.tableau[x+1][y-1] == enemievalue && this.tableau[x+2][y-2] == enemievalue && this.tableau[x+3][y-3] == this.player.numjoueur) {
        this.tableau[x+1][y-1] = 0;
        this.tableau[x+2][y-2] = 0;
        result.tenaille = true;
    } else if (this.tableau[x+1] != undefined && this.tableau[x+2] != undefined && this.tableau[x+3] != undefined && this.tableau[x+1][y+1] == enemievalue && this.tableau[x+2][y+2] == enemievalue && this.tableau[x+3][y+3] == this.player.numjoueur) {
        this.tableau[x+1][y+1] = 0;
        this.tableau[x+2][y+2] = 0;
        result.tenaille = true;
    }
    console.log(result);
    return result;
}

module.exports = Pente;