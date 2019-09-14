const express = require('express');
const knex	=	require('knex');
const cors = require('cors');
var bodyParser = require('body-parser')


const db = knex ({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'avcreations'
  }
});

const app	=	express();
app.use(cors());

//app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/', (req, res)=>{
	db.select('*').from('matchtable')
	.orderBy('matchid', 'desc')
	.then(data =>{
	res.send(data);
});
})

app.post('/balls', (req, res)=>{

	var {matchid} = req.body;
	db.select('*').from('balltable')
	.where('matchid','=', matchid)
	.orderBy('ballid').then(data =>{
	res.send(data);
});
})

app.post('/creatematch', (req, res)=>{
	console.log(req.body)
	const {team1,team2,overs,matchdate} = req.body;
	var name = team1+' vs '+team2;
	db('matchtable')
	.returning('*')
	.insert({team1:team1, team2:team2, name:name, overs:overs, matchdate:matchdate})
	.then(match=>{res.json(match[0])})
	.catch(err=>{res.json(err)});
	})

app.post('/createOvers', (req, res)=>{
var rows = req.body;
var chunkSize = 300;
db.batchInsert('balltable', rows, chunkSize)
  .returning('ballid')
  .catch(err=>{res.json('unable to create match')});
})
app.listen(env.process.PORT || 3000);