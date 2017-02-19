#!/usr/bin/env node

var path = require('path')
var fs = require('fs')
var norcal = require('norcal')
var hyperlog = require('hyperlog')
var level = require('level')
var through = require('through2')
var strftime = require('strftime')

var db = {
  log: level('./log.db'),
  index: level('./index.db')
}
// var db = {
//   log: level('/home/sww/.norcal/log.db'),
//   index: level('/home/sww/.norcal/index.db')
// }
var agenda = norcal({
  log: hyperlog(db.log, { valueEncoding: 'json' }),
  db: db.index
})

if (process.argv.length === 2) {
  var begin = new Date()
  var end = new Date()
  // end.setDate(end.getDate() + 7)
  end.setDate(end.getDate() + 30)

  console.log('UPCOMING 30 DAYS')
  agenda.query({
    gt: begin,
    lt: end
  }).pipe(through.obj(function (ev, _, next) {
    var time = strftime('%a %b %e %H:%M', ev.time)
    console.log(time + ': ' + ev.value.title)
    next()
  }))
}

else if (process.argv[2] === 'add' && process.argv.length === 5) {
  agenda.add(process.argv[3], {
    value: {
      title: process.argv[4],
    },
    created: new Date()
  }, function (err, node, id) {
    console.log('[' + node.value.k + '] Added "' + node.value.v.value.title + '": ' + node.value.v.time + '.')
  })
}

else {
  printUsage()
}

function printUsage () {
  fs.createReadStream(path.join(__dirname, 'usage.txt')).pipe(process.stdout)
}

