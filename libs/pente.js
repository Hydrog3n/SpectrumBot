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
            if (x >= 6 && x <= 12 && y >= 6 && y <= 12) {
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
        "tenaille": false, 
        "nbtenaille": 0
    };

    if (this.tableau[x-1] != undefined && this.tableau[x-2] != undefined && this.tableau[x-3] != undefined && this.tableau[x-1][y] == undefined
    && this.tableau[x-1][y] == enemievalue && this.tableau[x-2][y] == enemievalue && this.tableau[x-3][y] == this.player.numerojoueur) {
        this.tableau[x-1][y] = 0;
        this.tableau[x-2][y] = 0;
        result.tenaille = true;
        result.nbtenaille++;
    } else if (this.tableau[x+1] != undefined && this.tableau[x+2] != undefined && this.tableau[x+3] != undefined && this.tableau[x+1][y] == undefined
    && this.tableau[x+1][y] == enemievalue && this.tableau[x+2][y] == enemievalue && this.tableau[x+3][y] == this.player.numerojoueur) {
        this.tableau[x+1][y] = 0;
        this.tableau[x+2][y] = 0;
        result.tenaille = true;
        result.nbtenaille++;
    } else if (this.tableau[x][y+1] != undefined && this.tableau[x][y+2] != undefined && this.tableau[x][y+3] != undefined 
    && this.tableau[x][y+1] == enemievalue && this.tableau[x][y+2] == enemievalue && this.tableau[x][y+3] == this.player.numerojoueur) {
        this.tableau[x+1][y] = 0;
        this.tableau[x+2][y] = 0;
        result.tenaille = true;
        result.nbtenaille++;
    } else if (this.tableau[x][y-1] != undefined && this.tableau[x][y-2] != undefined && this.tableau[x][y-3] != undefined 
    && this.tableau[x][y-1] == enemievalue && this.tableau[x][y-2] == enemievalue && this.tableau[x][y-3] == this.player.numerojoueur) {
        this.tableau[x][y-1] = 0;
        this.tableau[x][y-2] = 0;
        result.tenaille = true;
        result.nbtenaille++;
    } else if (this.tableau[x-1] != undefined && this.tableau[x-2] != undefined && this.tableau[x-3] != undefined && this.tableau[x-1][y+1] != undefined && this.tableau[x-2][y+1] != undefined && this.tableau[x-3][y+3] != undefined 
    && this.tableau[x-1][y+1] == enemievalue && this.tableau[x-2][y+2] == enemievalue && this.tableau[x-3][y+3] == this.player.numerojoueur) {
        this.tableau[x-1][y+1] = 0;
        this.tableau[x-2][y+2] = 0;
        result.tenaille = true;
        result.nbtenaille++;
    } else if (this.tableau[x-1] != undefined && this.tableau[x-2] != undefined && this.tableau[x-3] != undefined && this.tableau[x][y-1] != undefined && this.tableau[x][y-2] != undefined && this.tableau[x][y-3] != undefined 
    && this.tableau[x-1][y-1] == enemievalue && this.tableau[x-2][y-2] == enemievalue && this.tableau[x-3][y-3] == this.player.numerojoueur) {
        this.tableau[x-1][y-1] = 0;
        this.tableau[x-2][y-2] = 0;
        result.tenaille = true;
        result.nbtenaille++;
    } else if (this.tableau[x+1] != undefined && this.tableau[x+2] != undefined && this.tableau[x+3] != undefined && this.tableau[x+1][y-1] != undefined && this.tableau[x+2][y-2] != undefined && this.tableau[x+3][y-3] != undefined 
    && this.tableau[x+1][y-1] == enemievalue && this.tableau[x+2][y-2] == enemievalue && this.tableau[x+3][y-3] == this.player.numerojoueur) {
        this.tableau[x+1][y-1] = 0;
        this.tableau[x+2][y-2] = 0;
        result.tenaille = true;
        result.nbtenaille++;
    } else if (this.tableau[x+1] != undefined && this.tableau[x+2] != undefined && this.tableau[x+3] != undefined && this.tableau[x+1][y+1] != undefined && this.tableau[x+2][y+2] != undefined && this.tableau[x+3][y+3] != undefined 
    && this.tableau[x+1][y+1] == enemievalue && this.tableau[x+2][y+2] == enemievalue && this.tableau[x+3][y+3] == this.player.numerojoueur) {
        this.tableau[x+1][y+1] = 0;
        this.tableau[x+2][y+2] = 0;
        result.tenaille = true;
        result.nbtenaille++;
    }
    console.log(result);
    result.tableau = this.tableau;
    return result;
};

Pente.prototype.win = function(x, y) {
    var valid = true;
    var poidx = 0;
    var poidy = 0;
    var poidxy = 0;
    var poidyx = 0;

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
    valid = true;
    var i = x;
    var j = y;
    while (valid == true) {
        i--;
        j++;
        if ( poidyx >= 4) {
            return true;
        }
        if (i < 0 || j > 18) {
            valid = false;
        }
        if (valid && this.tableau[i][j] && this.tableau[i][j] == this.player.numerojoueur) {
            poidyx++;
            
        } else {
            valid = false;
        }
    }

    valid = true;
    var i = x;
    var j = y;
    while (valid == true) {
        i++;
        j--;
        if ( poidyx >= 4) {
            return true;
        }
        if (j < 0 || i > 18) {
            valid = false;
        }
        if (valid && this.tableau[i][j] && this.tableau[i][j] == this.player.numerojoueur) {
            poidyx++;
        } else {
            valid = false;
        }
    }

    valid = true;
    var i = x;
    var j = y;
    while (valid == true) {
        i--;
        j--;
        if ( poidxy >= 4) {
            return true;
        }
        if (i < 0 || j < 0) {
            valid = false;
        }
        if (valid && this.tableau[i][j] && this.tableau[i][j] == this.player.numerojoueur) {
            poidxy++;
        } else {
            valid = false;
        }
    }

    valid = true;
    var i = x;
    var j = y;
    while (valid == true) {
        i++;
        j++;
        if ( poidxy >= 4) {
            return true;
        }
        if (i >  18|| j > 18) {
            valid = false;
        }
        if (valid && this.tableau[i][j] && this.tableau[i][j] == this.player.numerojoueur) {
            poidxy++;
        } else {
            valid = false;
        }
    }
    return false;
}

module.exports = Pente;