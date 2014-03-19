DefineThis
==========

A one sitting project I made to define words, no clutter involved.


Steps to make it work

1. add a "module" folder in the main directory
2. add a "keys.js" file in the "module" folder.
3. put `module.exports.wordnikKey = 'APIKEYHERE';` in your keys.js file
4. add a "db.js" file in the "module" folder.
5. put `module.exports.mongoDB = 'yourMongoURL';` in your db.js file
6. do `npm install` to add everything from package.json

Could use refactoring, but in the spirit of this being a one sitting project, I will probably not do much if anything to it.
