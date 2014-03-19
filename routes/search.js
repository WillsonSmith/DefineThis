
/*
 * GET users listing.
 */
var mongo = require('mongodb');
//var mongoose = require('mongoose');
var monk = require('monk');
var mongoServer = require('../modules/db.js').mongoDB;
var apiKey = require('../modules/key.js').wordnikKey;
//var http = require('http');

var apiBase = 'api.wordnik.com',
    searchWord = '/v4/word.json/',
    definitionFlags = '/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key=';

function render(res, word, definition){

  res.render('search', { title: 'result', word: word, definition: definition });

}

function getWord(res, query){

  var db = monk(mongoServer),
      words = db.get('words');

  function queryApi(con, word){
    var body = '';
    var options = {
      host: apiBase,
      port: 80,
      path: searchWord + word + definitionFlags + apiKey,
      method: 'GET'
    };

    require('http').request(options, function(res){

      res.setEncoding('utf8');

      res.on('data', function(chunk) {

        body += chunk;

      });
      res.on('error', function(er){

        console.log('err', er.message);

      });
      res.on('end', function(){

      var data = JSON.parse(body);
      var items = {

        'word': word,
        definitions: []

      };
      for (var i = 0; i < data.length; i++){
        var object = {};
        object.definition = data[i].text;
        object.type = data[i].partOfSpeech;
        items.definitions.push(object);

      }

      render(con, items.word, items.definitions);

      words.insert({word: word, definitions: items.definitions}, function(err, doc){
        if (err){

          console.log('problem');

        }
      });

      });

    }).end();

  }
  //words.drop();
  words.findOne({word: query}).error(function(er){

    console.log('error', er);

  }).success(function(data){

    if (!data){

      console.log('no');
      queryApi(res, query);

    }else{

      render(res, data.word, data.definitions);

    }

  });

}

exports.list = function(req, res){
  var query = req.params.query.toLowerCase().replace(/\s+/g, '');
  //searchWord = query;

  getWord(res, query);

};
