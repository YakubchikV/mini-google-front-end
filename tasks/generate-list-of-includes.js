module.exports = function (grunt) {
  grunt.registerTask("generate-list-of-includes", function () {
    var files = this.files;
    var bem = grunt.file.readJSON('bem.json');
    var blocksIncludeString = '';

    for (var i in bem.blocks) {
      var block = bem.blocks[i];
      blocksIncludeString += '<link rel="stylesheet" href="styles/blocks/' + block + '.css">\n';
    }

    grunt.file.write('.tmp/includes/dev-blocks-include.html', blocksIncludeString);
  });
};
