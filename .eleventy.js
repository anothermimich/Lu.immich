const eleventyImage = require("@11ty/eleventy-img");
const path = require("path");

// Extrai as funções corretamente do objeto importado (compatibilidade ESM/CJS)
const Image = eleventyImage.default || eleventyImage;
const generateHTML = eleventyImage.generateHTML;

module.exports = function (eleventyConfig) {
  // Passthrough Copy (Mantendo a sua estrutura de pastas intacta)
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/icons");
  eleventyConfig.addPassthroughCopy("src/project-files");

  // --- SHORTCODE DE IMAGEM OTIMIZADA ---
  eleventyConfig.addAsyncShortcode(
    "image",
    async function (src, alt, className = "", sizes = "100vw") {
      if (!alt) {
        throw new Error(`Acessibilidade comprometida: faltando atributo 'alt' na imagem ${src}`);
      }

      // Resolve o caminho da imagem relativo à pasta src
      let imageSrc = src;
      if (!src.startsWith(".") && !src.startsWith("http")) {
        imageSrc = path.join("./src", src);
      }

      // Motor de processamento (Gera AVIF e WEBP com fallback para JPEG)
      let metadata = await Image(imageSrc, {
        widths: [400, 800, 1280],
        formats: ["avif", "webp", "jpeg"],
        outputDir: "./_site/img/opt/",
        urlPath: "/img/opt/",
        filenameFormat: function (id, src, width, format) {
          const extension = path.extname(src);
          let name = path.basename(src, extension);

          // Limpeza avançada de string
          name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          name = name.replace(/[^a-zA-Z0-9]/g, "-");
          name = name.replace(/-+/g, "-").toLowerCase();

          return `${name}-${width}w.${format}`;
        },
      });

      let imageAttributes = {
        alt,
        class: className,
        sizes,
        loading: "lazy",
        decoding: "async",
      };

      return generateHTML(metadata, imageAttributes);
    },
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
