var Package = require('../app/models/package');

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/twd');

var packages = [
    new Package({
        imagePath: '/images/6_pawn.png',
        name: 'Pawn',
        description: 'The Pawn Package',
        price: 6250
    }),
    new Package({
        imagePath: '/images/5_knight.png',
        name: 'Knight',
        description: 'The Knight Package',
        price: 12500
    }),
    new Package({
        imagePath: '/images/4_bishop.png',
        name: 'Bishop',
        description: 'The Bishop Package',
        price: 25000
    }),
    new Package({
        imagePath: '/images/3_rook.png',
        name: 'Rook',
        description: 'The Rook Package',
        price: 50000
    }),
    new Package({
        imagePath: '/images/2_queen.png',
        name: 'Queen',
        description: 'The Queen Package',
        price: 100000
    }),
    new Package({
        imagePath: '/images/1_king.png',
        name: 'King',
        description: 'The King Package',
        price: 200000
    })
];

var done = 0;
for (var i = 0; i < packages.length; i++) {
    packages[i].save(function(err, result) {
        done++;
        if (done === packages.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
