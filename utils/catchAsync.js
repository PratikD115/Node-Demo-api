module.exports = fs => {
    return ((req, res, next) => {
        fs(req, res, next).catch(next);
    })
}