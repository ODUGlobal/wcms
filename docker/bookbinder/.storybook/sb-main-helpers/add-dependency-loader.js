// eslint-disable-next-line func-names
module.exports = function (source, map) {
  this.addDependency(this.query.file);
  this.callback(null, source, map);
};
