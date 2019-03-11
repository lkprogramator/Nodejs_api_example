module.exports = errorHandler;

function errorHandler(err, req, res, next) {

    console.log('errorHandler', err );

    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    if (err.name === 'NotFoundError') {
        // jwt authentication error
        return res.status(404).json({ message: 'Nowhere to be found' });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}
