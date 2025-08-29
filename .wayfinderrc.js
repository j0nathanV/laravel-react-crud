module.exports = {
  transformers: {
    routes: (content) => {
      return content.replace(
        /import confirm from '\.\/confirm'/g,
        "import confirmRoutes from './confirm'"
      );
    }
  }
};
