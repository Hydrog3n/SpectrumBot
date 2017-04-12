var async = require('async');

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
    this.tableau = result.tableau;
    return result;
};

Pente.prototype.win = function(x, y) {
    var result = {
        "win": false,
        "tableau": this.tableau
    };
    var valid = true;
    var poidx = 0;
    var poidy = 0;
    var poidxy = 0;
    for(i = x+1; i <= 18; i++ ) {
        if (poidx >= 4) {
            return true;
        }
        if (valid && this.tableau[i][y] && this.tableau[i][y] == this.player.numerojoueur) {
            valid = true;
            poidx++;
        } else {
            valid = false;
            break;
        }
    }
    valid = true;
    for(i = x-1; i >= 0; i--) {
        if (poidx >= 4) {
            return true;
        }
        if (valid && this.tableau[i][y] && this.tableau[i][y] == this.player.numerojoueur) {
            valid = true;
            poidx++;
        } else {
            valid = false;
            break;
        }
    }
    valid = true;
    for(i = y+1; i <= 18; i++) {
        if (poidy >= 4) {
            return true;
        }
        if (valid && this.tableau[x][i] && this.tableau[x][i] == this.player.numerojoueur) {
            valid = true;
            poidy++;
        } else {
            valid = false;
            break;
        }
    }
    valid = true;
    for(i = y-1; i >= 0; i--) {
        if (poidy >= 4) {
            return true;
        }
        if (valid && this.tableau[x][i] && this.tableau[x][i] == this.player.numerojoueur) {
            valid = true;
            poidy++;
        } else {
            valid = false;
            break;
        }
    }
    valid = true
    for(i = y-1; i >= 0; i--) {
        for(j= x+1; j <= 18; j++) {
            if (poidyx >= 4) {
                return true;
            }
            if (valid && this.tableau[i][j] && this.tableau[i][j] == this.player.numerojoueur) {
                valid = true;
                poidyx++;
            } else {
                valid = false;
                break;
            }
        }
    }

}

module.exports = Pente;