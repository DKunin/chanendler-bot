function simpleRequest(protocol, options) {
    return new Promise((resolve, reject) => {
        protocol
            .get(options, response => {
                let str = '';

                response.on('data', function(chunk) {
                    str += chunk;
                });

                response.on('end', function() {
                    resolve(JSON.parse(str));
                });
            })
            .on('error', e => {
                console.log(e);
                reject(e);
            });
    });
}

function simplePostRequest(protocol, options, data) {
    return new Promise((resolve, reject) => {
        var postreq = protocol
            .request(options, response => {
                let str = '';

                response.on('data', function(chunk) {
                    str += chunk;
                });

                response.on('end', function() {
                    try {
                        str = JSON.parse(str);
                    } catch (err) {}
                    resolve(str);
                });
            })
            .on('error', e => {
                reject(e);
            });

        postreq.on('error', function(e) {
            reject('problem with request: ' + e.message);
        });
        postreq.write(JSON.stringify(data));
        postreq.end();
    });
}

module.exports = { simpleRequest, simplePostRequest };
