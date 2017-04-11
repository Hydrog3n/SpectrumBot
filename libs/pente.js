var Pente = function(tableau, nbtour, player, started) {
    this.tableau = tableau;
    this.nbtour = nbtour;
    this.player = player;
    this.started = started;
};

Pente.prototype.autorise = function(x, y) {
    if (this.tableau[x][y] == 0) {
        if (this.started && this.turn == 2) {
            var interditx = [7, 8, 9, 10, 11, 12];
            var interdity = [7, 8, 9, 10, 11, 12];
            if (interditx.indexOf(x) == 1 && interdity.indexOf(y)) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }

}

Pente.prototype.coup = function(x, y) {
    this.tableau[x][y] = this.player.numerojoueur;
    return this.tableau[x][y];
}

Pente.prototype.tenaille = function(x, y) {
    var enemievalue = (this.player.numerojoueur == 1 ? 2 : 1);
    var result = { 
        "tableau" : this.tableau,
        "tenaille": false 
    };

    if (this.tableau[x-1] && this.tableau[x-2] && this.tableau[x-3] && this.tableau[x-1][y] == enemievalue && this.tableau[x-2][y] == enemievalue && this.tableau[x-3][y] == this.player.numjoueur) {
        this.tableau[x-1][y] = 0;
        this.tableau[x-2][y] = 0;
        result.tenaille = true;
    } else if (this.tableau[x+1] && this.tableau[x+2] && this.tableau[x+3] && this.tableau[x+1][y] == enemievalue && this.tableau[x+2][y] == enemievalue && this.tableau[x+3][y] == this.player.numjoueur) {
        this.tableau[x+1][y] = 0;
        this.tableau[x+2][y] = 0;
        result.tenaille = true;
    } else if (this.tableau[x][y+1] && this.tableau[x][y+2] && this.tableau[x][y+3] && this.tableau[x][y+1] == enemievalue && this.tableau[x][y+2] == enemievalue && this.tableau[x][y+3] == this.player.numjoueur) {
        this.tableau[x+1][y] = 0;
        this.tableau[x+2][y] = 0;
        result.tenaille = true;
    } else if (this.tableau[x][y-1] && this.tableau[x][y-2] && this.tableau[x][y-3] && this.tableau[x][y-1] == enemievalue && this.tableau[x][y-2] == enemievalue && this.tableau[x][y-3] == this.player.numjoueur) {
        this.tableau[x][y-1] = 0;
        this.tableau[x][y-2] = 0;
        result.tenaille = true;
    } else if (this.tableau[x-1] && this.tableau[x-2] && this.tableau[x-3] && this.tableau[x-1][y+1] == enemievalue && this.tableau[x-2][y+2] == enemievalue && this.tableau[x-3][y+3] == this.player.numjoueur) {
        this.tableau[x-1][y+1] = 0;
        this.tableau[x-2][y+2] = 0;
        result.tenaille = true;
    } else if (this.tableau[x-1] && this.tableau[x-2] && this.tableau[x-3] && this.tableau[x-1][y-1] == enemievalue && this.tableau[x-2][y-2] == enemievalue && this.tableau[x-3][y-3] == this.player.numjoueur) {
        this.tableau[x-1][y-1] = 0;
        this.tableau[x-2][y-2] = 0;
        result.tenaille = true;
    } else if (this.tableau[x+1] && this.tableau[x+2] && this.tableau[x-3] && this.tableau[x+1][y-1] == enemievalue && this.tableau[x+2][y-2] == enemievalue && this.tableau[x+3][y-3] == this.player.numjoueur) {
        this.tableau[x+1][y-1] = 0;
        this.tableau[x+2][y-2] = 0;
        result.tenaille = true;
    } else if (this.tableau[x+1] && this.tableau[x+2] && this.tableau[x+3] && this.tableau[x+1][y+1] == enemievalue && this.tableau[x+2][y+2] == enemievalue && this.tableau[x+3][y+3] == this.player.numjoueur) {
        this.tableau[x+1][y+1] = 0;
        this.tableau[x+2][y+2] = 0;
        result.tenaille = true;
    }
    return result;
}

module.exports = Pente;