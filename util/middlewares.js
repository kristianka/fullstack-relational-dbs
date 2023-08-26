const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    return res.status(400).json({ error })
}

module.exports = { errorHandler }