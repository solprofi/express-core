export const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        status: 'error',
        message: 'You must be logged in to access this resource'
      });
    }
    next();
  };
  
  // Optional: Role-based authentication
  export const hasRole = (role) => {
    return (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      next();
    };
  };