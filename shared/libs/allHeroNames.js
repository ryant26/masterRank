const offensive = [
    'doomfist',
    'genji',
    'mccree',
    'pharah',
    'reaper',
    'soldier76',
    'sombra',
    'tracer'
];

const defensive = [
    'bastion',
    'hanzo',
    'junkrat',
    'mei',
    'torbjorn',
    'widowmaker'
];

const tank = [
    'dva',
    'orisa',
    'reinhardt',
    'roadhog',
    'winston',
    'zarya'
];

const support = [
    'ana',
    'lucio',
    'mercy',
    'moira',
    'symmetra',
    'zenyatta'
];

const names = [
    ...offensive,
    ...defensive,
    ...tank,
    ...support
];

module.exports = {
    names,
    offensive,
    defensive,
    tank,
    support
};