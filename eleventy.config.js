import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";

function readMedia() {
    const input = readFileSync("./website/_data/media.csv");
    const records = parse(input, {
        columns: true,
        skip_empty_lines: true,
    });
    console.log(`${records.length} records found.`);
    return records;
}


export default async function(eleventyConfig) {
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

    // All of the files for the website will be in the `website/` folder.
    eleventyConfig.setInputDirectory("website");

    // Extra files
    eleventyConfig.addPassthroughCopy('website/assets');
    eleventyConfig.setLayoutsDirectory("_layouts");

    eleventyConfig.addPassthroughCopy('website/media/files');
    eleventyConfig.addDataExtension("csv", (contents) => {
        const records = parse(contents, {
            columns: true,
            skip_empty_lines: true,
        });
        return records;
    });
    const media = readMedia();

    for (const mediaItem of media) {
        const path = `media/${mediaItem.filename}.liquid`;
        eleventyConfig.addTemplate(path, mediaItem.description, {
            layout: "media.liquid",
            filename: mediaItem.filename,
        });
    }
};

