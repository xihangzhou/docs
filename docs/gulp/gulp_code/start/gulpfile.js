const gulp = require("gulp");
const del = require("del");
function defaultTask(cb) {
  // place code for your default task here
  cb();
}

const dist = "./copy_destination";
const clear = () => del(dist);
const since = (task) => (file) =>
  gulp.lastRun(task) > file.stat.ctime ? gulp.lastRun(task) : 0;

const copy = () =>
  gulp.src("./copy_src/**/*.js", { since: since(copy) }).pipe(gulp.dest(dist));

const watch = () => {
  gulp.watch("./copy_src/**/*.js", {}, copy);
};

const dev = gulp.series(clear, copy,watch);

module.exports = {
  defaultTask,
  copy,
  dev,
};
