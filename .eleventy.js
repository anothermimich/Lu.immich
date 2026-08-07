module.exports = function (eleventyConfig) {
  // Tell Eleventy to copy these static folders directly to _site
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/icons");
  eleventyConfig.addPassthroughCopy("src/project-files");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
