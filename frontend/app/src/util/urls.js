var Urls = {};

if (process.env.NODE_ENV === 'production') {
  Urls = {
    api: 'http://api.sequentify.com',
  };
} else if (process.env.NODE_ENV === 'development') {
  Urls = {
    api: 'http://localhost:3000',
  };
}

export default Urls;
