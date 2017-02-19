# agenda

> a small cli program to keep track of things in the future

## Usage

```
$ agenda --help

USAGE:

  agenda [day|week|month]

    Prints all upcoming events for the time period ahead. If no argument is
    given, 'week' is shown.


  agenda add 'date string' 'event description'

    Creates a new event with the given description and date.

$ agenda add 'next wednesday' 'L.A. conference'
[825e33a09164898b] Added "L.A. conference": next wednesday.

$ agenda
Wed Feb 22: L.A. conference
```

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install -g agenda-cli
```

Note that the package name is `agenda-cli`, not `agenda`.

## Future

`agenda` uses [norcal](https://github.com/substack/norcal) under the hood, which
means the underlying calendaring information is stored in a peer-to-peer data
structure. This could have fun & interesting ramifications, such as serverless
sharing of agendas with others!

## License

ISC

