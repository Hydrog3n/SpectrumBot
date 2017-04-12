var Pente = function(tableau, nbtour, player, started) {
    this.tableau = tableau;
    this.nbtour = nbtour;
    this.player = player;
    this.started = started;
};

Pente.prototype.autorise = function(x, y) {
    if (this.tableau[x][y] == 0) {
        if (this.started && this.nbtour == 2) {
            var interdit = [6, 7, 8, 9, 10, 11];
            if (x >= 6 && x <= 11 && y >= 6 && y <= 11) {
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

    if (this.tableau[x-1] != undefined && this.tableau[x-2] != undefined && this.tableau[x-3] != undefined && this.tableau[x-1][y] == enemievalue && this.tableau[x-2][y] == enemievalue && this.tableau[x-3][y] == this.player.numerojoueur) {
        this.tableau[x-1][y] = 0;
        this.tableau[x-2][y] = 0;
        result.tenaille = true;
    } else if (this.tableau[x+1] != undefined && this.tableau[x+2] != undefined && this.tableau[x+3] != undefined && this.tableau[x+1][y] == enemievalue && this.tableau[x+2][y] == enemievalue && this.tableau[x+3][y] == this.player.numerojoueur) {
        this.tableau[x+1][y] = 0;
        this.tableau[x+2][y] = 0;
        result.tenaille = true;
    } else if (this.tableau[x][y+1] != undefined && this.tableau[x][y+2] != undefined && this.tableau[x][y+3] != undefined && this.tableau[x][y+1] == enemievalue && this.tableau[x][y+2] == enemievalue && this.tableau[x][y+3] == this.player.numerojoueur) {
        console.log('Tenaille');
        this.tableau[x+1][y] = 0;
        this.tableau[x+2][y] = 0;
        result.tenaille = true;
    } else if (this.tableau[x][y-1] != undefined && this.tableau[x][y-2] != undefined && this.tableau[x][y-3] != undefined && this.tableau[x][y-1] == enemievalue && this.tableau[x][y-2] == enemievalue && this.tableau[x][y-3] == this.player.numerojoueur) {
        this.tableau[x][y-1] = 0;
        this.tableau[x][y-2] = 0;
        result.tenaille = true;
    } else if (this.tableau[x-1] != undefined && this.tableau[x-2] != undefined && this.tableau[x-3] != undefined && this.tableau[x-1][y+1] == enemievalue && this.tableau[x-2][y+2] == enemievalue && this.tableau[x-3][y+3] == this.player.numerojoueur) {
        this.tableau[x-1][y+1] = 0;
        this.tableau[x-2][y+2] = 0;
        result.tenaille = true;
    } else if (this.tableau[x-1] != undefined && this.tableau[x-2] != undefined && this.tableau[x-3] != undefined && this.tableau[x-1][y-1] == enemievalue && this.tableau[x-2][y-2] == enemievalue && this.tableau[x-3][y-3] == this.player.numerojoueur) {
        this.tableau[x-1][y-1] = 0;
        this.tableau[x-2][y-2] = 0;
        result.tenaille = true;
    } else if (this.tableau[x+1] != undefined && this.tableau[x+2] != undefined && this.tableau[x-3] != undefined && this.tableau[x+1][y-1] == enemievalue && this.tableau[x+2][y-2] == enemievalue && this.tableau[x+3][y-3] == this.player.numerojoueur) {
        this.tableau[x+1][y-1] = 0;
        this.tableau[x+2][y-2] = 0;
        result.tenaille = true;
    } else if (this.tableau[x+1] != undefined && this.tableau[x+2] != undefined && this.tableau[x+3] != undefined && this.tableau[x+1][y+1] == enemievalue && this.tableau[x+2][y+2] == enemievalue && this.tableau[x+3][y+3] == this.player.numerojoueur) {
        this.tableau[x+1][y+1] = 0;
        this.tableau[x+2][y+2] = 0;
        result.tenaille = true;
    }
    console.log(result);
    return result;
};

Pente.prototype.win = function(x, y) {
    var result = {
        "win": false,
        "tableau": this.tableau
    };

    async.forEach(this.tableau, function(dim) {

    });
}

module.exports = Pente;