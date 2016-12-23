var Urls = {};

if (process.env.ENV === "production") {
  Urls = {
    api: process.env.API_PROD_URL,
  };
} else { // defaults to dev to make setting up locally easier
  Urls = {
    api: process.env.API_DEV_URL,
  };
}

export default Urls;
