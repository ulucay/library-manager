const Sequelize = require('sequelize');

//Sets up model for Book
module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}
    Book.init ({
        title: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'Please provide a value for "title".'
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'Please provide a value for "author".'
                },
                isAlpha: {
                    msg: 'Please enter letter values for "author".'
                }
            }
        },
        genre: {
            type: Sequelize.STRING,
            validate:{
                isAlpha:{
                    msg: 'Please enter letter values for "genre".'
                }
            }
        },
        year: {
            type:Sequelize.INTEGER,
            validate:{
                isNumeric:{
                    msg: 'Please enter a numeric value for "year".'
                }
            }
        }  
    }, { sequelize });

    return Book;
}