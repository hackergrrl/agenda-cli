#!/usr/bin/env node

var path = require('path')
var fs = require('fs')
var norcal = require('norcal')
var hyperlog = require('hyperlog')
var level = require('level')
var through = require('through2')
var strftime = require('strftime')
var config = require('application-config-path')
var mkdir = require('mkdirp')

var root = config('agenda')
mkdir.sync(root)

var db = {
  log: level(path.join(root, 'log.db')),
  index: level(path.join(root, 'index.db'))
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
  showWeek()
}

else if (process.argv[2] === 'week' && process.argv.length === 3) {
  showWeek()
}

else if (process.argv[2] === 'day' && process.argv.length === 3) {
  showDay()
}

else if (process.argv[2] === 'month' && process.argv.length === 3) {
  showMonth()
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

function display (begin, end) {
  agenda.query({
    gt: begin,
    lt: end
  }).pipe(through.obj(function (ev, _, next) {
    var time = strftime('%a %b %e %H:%M', ev.time)
    console.log(time + ': ' + ev.value.title)
    next()
  }))
}

function showDay () {
  var begin = new Date()
  var end = new Date()
  end.setDate(end.getDate() + 1)
  display(begin, end)
}

function showWeek () {
  var begin = new Date()
  var end = new Date()
  end.setDate(end.getDate() + 7)
  display(begin, end)
}

function showMonth () {
  var begin = new Date()
  var end = new Date()
  end.setDate(end.getDate() + 30)
  display(begin, end)
}
