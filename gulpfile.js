#!/usr/bin/node

'use strict'

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var del = require('del');
var replace = require('gulp-replace');
var injectPartials = require('gulp-inject-partials');
var inject = require('gulp-inject');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var merge = require('merge-stream');

gulp.paths = {
    dist: 'dist',
};

var paths = gulp.paths;

gulp.task('sass', function () {
    return gulp.src('./scss/**/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', gulp.series('sass', function() {
    browserSync.init({
        port: 3000,
        server: "./",
        ghostMode: false,
        notify: false
    });

    gulp.watch('scss/**/*.scss', gulp.series('sass'));
    gulp.watch('**/*.html').on('change', browserSync.reload);
    gulp.watch('js/**/*.js').on('change', browserSync.reload);

}));

// Static Server without watching scss files
gulp.task('serve:lite', function() {

    browserSync.init({
        server: "./",
        ghostMode: false,
        notify: false
    });

    gulp.watch('**/*.css').on('change', browserSync.reload);
    gulp.watch('**/*.html').on('change', browserSync.reload);
    gulp.watch('js/**/*.js').on('change', browserSync.reload);

});

gulp.task('sass:watch', function () {
    gulp.watch('./scss/**/*.scss');
});

/* inject partials like sidebar and navbar */
gulp.task('injectPartial', function () {
  return gulp.src("./**/*.html", { base: "./" })
    .pipe(injectPartials())
    .pipe(gulp.dest("."));
});

/* inject JS and CCS assets into HTML */
gulp.task('injectCommonAssets', function () {
  return gulp.src('./**/*.html')
    .pipe(inject(gulp.src([ 
        './vendors/feather/feather.css',
        './vendors/ti-icons/css/themify-icons.css',
        './vendors/css/vendor.bundle.base.css', 
        './vendors/js/vendor.bundle.base.js',
    ], {read: false}), {name: 'plugins', relative: true}))
    .pipe(inject(gulp.src([
        './css/*.css', 
        './js/off-canvas.js', 
        './js/hoverable-collapse.js', 
        './js/template.js', 
        './js/settings.js', 
        './js/todolist.js'
    ], {read: false}), {relative: true}))
    .pipe(gulp.dest('.'));
});

/* inject JS and CCS assets into HTML */
gulp.task('injectLayoutStyles', function () {
    var verticalLightStream = gulp.src(['./**/vertical-default-light/**/*.html',
            './index.html'])
        .pipe(inject(gulp.src([
            './css/vertical-layout-light/style.css', 
        ], {read: false}), {relative: true}))
        .pipe(gulp.dest('.'));
    return merge(verticalLightStream);
});

/*replace image path and linking after injection*/
gulp.task('replacePath', function(){
    var replacePath1 = gulp.src(['./pages/*/*.html'], { base: "./" })
        .pipe(replace('="images/', '="../../images/'))
        .pipe(replace('href="pages/', 'href="../../pages/'))
        .pipe(replace('href="index.html"', 'href="../../index.html"'))
        .pipe(gulp.dest('.'));
    var replacePath2 = gulp.src(['./pages/*.html'], { base: "./" })
        .pipe(replace('="images/', '="../images/'))
        .pipe(replace('"pages/', '"../pages/'))
        .pipe(replace('href="index.html"', 'href="../index.html"'))
        .pipe(gulp.dest('.'));
    var replacePath3 = gulp.src(['./*/index.html'], { base: "./" })
        .pipe(replace('="images/', '="images/'))
        .pipe(gulp.dest('.'));
    return merge(replacePath1 , replacePath2, replacePath3);
});

/*sequence for injecting partials and replacing paths*/
gulp.task('inject', gulp.series('injectPartial' , 'injectCommonAssets' , 'injectLayoutStyles', 'replacePath'));

gulp.task('clean:vendors', function () {
    return del([
      'vendors/**/*'
    ]);
});

/*Building vendor scripts needed for basic template rendering*/
gulp.task('buildBaseVendorScripts', function() {
    return gulp.src([
        './node_modules/jquery/dist/jquery.min.js', 
        './node_modules/popper.js/dist/umd/popper.min.js', 
        './node_modules/bootstrap/dist/js/bootstrap.min.js', 
        './node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js'
    ])
      .pipe(concat('vendor.bundle.base.js'))
      .pipe(gulp.dest('./vendors/js'));
});

/*Building vendor styles needed for basic template rendering*/
gulp.task('buildBaseVendorStyles', function() {
    return gulp.src(['./node_modules/perfect-scrollbar/css/perfect-scrollbar.css'])
      .pipe(concat('vendor.bundle.base.css'))
      .pipe(gulp.dest('./vendors/css'));
});

/*Scripts for addons*/
gulp.task('copyAddonsScripts', function() {
    var aScript1 = gulp.src(['node_modules/chart.js/dist/Chart.min.js'])
        .pipe(gulp.dest('./vendors/chart.js'));
    var aScript2 = gulp.src(['node_modules/jquery-bar-rating/dist/jquery.barrating.min.js'])
        .pipe(gulp.dest('./vendors/jquery-bar-rating'));
    var aScript4 = gulp.src(['node_modules/progressbar.js/dist/progressbar.min.js'])
        .pipe(gulp.dest('./vendors/progressbar.js'));
    var aScript5 = gulp.src(['node_modules/moment/moment.js'])
        .pipe(gulp.dest('./vendors/moment'));
    var aScript19 = gulp.src(['node_modules/raphael/raphael.min.js'])
        .pipe(gulp.dest('./vendors/raphael'));
    var aScript21 = gulp.src(['node_modules/progressbar.js/dist/progressbar.min.js'])
        .pipe(gulp.dest('./vendors/progressbar.js'));
    var aScript22 = gulp.src(['./node_modules/summernote/dist/**/*'])
        .pipe(gulp.dest('./vendors/summernote/dist'));
    var aScript23 = gulp.src(['node_modules/pwstabs/assets/jquery.pwstabs.min.js'])
        .pipe(gulp.dest('./vendors/pwstabs'));
    var aScript24 = gulp.src(['./node_modules/ace-builds/src-min/**/*'])
        .pipe(gulp.dest('./vendors/ace-builds/src-min'));
    var aScript25 = gulp.src(['./node_modules/lightgallery/dist/**/*'])
        .pipe(gulp.dest('./vendors/lightgallery'));
    var aScript26 = gulp.src(['node_modules/inputmask/dist/jquery.inputmask.bundle.js'])
        .pipe(gulp.dest('./vendors/inputmask'));
    var aScript29 = gulp.src(['node_modules/jquery-file-upload/js/jquery.uploadfile.min.js'])
        .pipe(gulp.dest('./vendors/jquery-file-upload'));
    var aScript30 = gulp.src(['node_modules/jquery-asColor/dist/jquery-asColor.min.js'])
        .pipe(gulp.dest('./vendors/jquery-asColor'));
    var aScript31 = gulp.src(['node_modules/jquery-asGradient/dist/jquery-asGradient.min.js'])
        .pipe(gulp.dest('./vendors/jquery-asGradient'));
    var aScript32 = gulp.src(['node_modules/jquery-asColorPicker/dist/jquery-asColorPicker.min.js'])
        .pipe(gulp.dest('./vendors/jquery-asColorPicker'));
    var aScript33 = gulp.src(['node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js'])
        .pipe(gulp.dest('./vendors/bootstrap-datepicker'));
    var aScript34 = gulp.src(['node_modules/moment/min/moment.min.js'])
        .pipe(gulp.dest('./vendors/moment'));
    var aScript35 = gulp.src(['node_modules/tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js'])
        .pipe(gulp.dest('./vendors/tempusdominus-bootstrap-4'));
    var aScript36 = gulp.src(['node_modules/codemirror/lib/**/*'])
        .pipe(gulp.dest('./vendors/codemirror/lib'));
    var aScript37 = gulp.src(['node_modules/codemirror/mode/**/*'])
        .pipe(gulp.dest('./vendors/codemirror/mode'));
    var aScript38 = gulp.src(['node_modules/codemirror/addon/**/*'])
        .pipe(gulp.dest('./vendors/codemirror/addon'));
    var aScript39 = gulp.src(['node_modules/datatables.net/js/jquery.dataTables.min.js'])
        .pipe(gulp.dest('./vendors/datatables.net'));
    var aScript40 = gulp.src(['node_modules/datatables.net-bs4/js/dataTables.bootstrap4.min.js'])
        .pipe(gulp.dest('./vendors/datatables.net-bs4'));
    var aScript41 = gulp.src(['node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css'])
        .pipe(gulp.dest('./vendors/datatables.net-bs4'));
    
    return merge(
        aScript1, aScript2, aScript4, aScript5, 
        aScript19, aScript21, aScript22, aScript23, 
        aScript24, aScript25, aScript26, aScript29, 
        aScript30, aScript31, aScript32, aScript33, 
        aScript34, aScript35, aScript36, aScript37, 
        aScript38, aScript39, aScript40, aScript41
    );
});

/* Clean and build vendor files */
gulp.task('default', gulp.series('clean:vendors', gulp.parallel('buildBaseVendorScripts', 'buildBaseVendorStyles', 'copyAddonsScripts')));

/* Build task */
gulp.task('build', gulp.series('clean:vendors', 'inject', 'default'));
