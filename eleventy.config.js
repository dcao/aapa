import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default async function(eleventyConfig) {
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

    // All of the files for the website will be in the `website/` folder.
    eleventyConfig.setInputDirectory("website");

    // Extra files
    eleventyConfig.addPassthroughCopy('website/assets');

    eleventyConfig.setLayoutsDirectory("_layouts");
};

