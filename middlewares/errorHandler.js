const errorHandler = (err, req, res, next) => {
  console.log(err);
  console.log(err.name);
  switch (err.name) {
    case 'SequelizeValidationError':
    case 'SequelizeUniqueConstraintError':
      res.status(400).json({ message: err.errors[0].message });
      break;

    case 'UsernameEmailPasswordRequired':
      res.status(400).json({ message: 'Username/Email or Password is required' });
      break;

    case 'NotEnoughCurrency':
      res.status(400).json({ message: "You don't have enough fate" });
      break;

    case 'UsernameEmailPasswordInvalid':
      res.status(401).json({ message: 'Username/Email or Password is invalid' });
      break;

    case 'Unauthenticated':
    case 'JsonWebTokenError':
      res.status(401).json({ message: 'Please login first' });
      break;

    case 'Forbidden':
      res.status(403).json({ message: 'You are not authorized' });
      break;

    case 'NotFound':
      res.status(404).json({ message: 'Data not found' });
      break;
  
    default:
      res.status(500).json({ message: 'Internal Server Error' });
      break;
  }
}

module.exports = errorHandler;