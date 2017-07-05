const PirateBay = require('thepiratebay');

PirateBay.topTorrents().then(console.log);

// PirateBay.search('avatar', {
//     orderBy: 'seeds',
//     sortBy: 'desc',
//     category: 205
// }).then(console.log).then(console.log).catch(console.log);
