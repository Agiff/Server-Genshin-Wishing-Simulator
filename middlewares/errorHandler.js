const errorHandler = (err, req, res, next) => {
  console.log(err.name);
  switch (err.name) {
    case 'SequelizeValidationError':
    case 'SequelizeUniqueConstraintError':
      res.status(400).json({ message: err.errors[0].message });
      break;

    case 'UsernameEmailPasswordRequired':
      res.status(400).json({ message: 'Username/Email or Password is required' });
      break;

    case 'UsernameEmailPasswordInvalid':
      res.status(401).json({ message: 'Username/Email or Password is invalid' });
      break;
  
    default:
      res.status(500).json({ message: 'Internal Server Error' });
      break;
  }
}

module.exports = errorHandler;