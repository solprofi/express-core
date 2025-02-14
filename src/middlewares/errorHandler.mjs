const errorHandlingMiddleware = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
};

export default errorHandlingMiddleware;
