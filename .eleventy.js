const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  // Automatically fixes root-relative paths for GitHub Pages subfolders
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Tell Eleventy to copy these static folders directly to _site
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/icons");
  eleventyConfig.addPassthroughCopy("src/project-files");

  return {
    pathPrefix: "/Lu.immich/", // THIS MUST MATCH YOUR REPOSITORY NAME EXACTLY
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
