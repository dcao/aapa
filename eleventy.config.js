import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";

function readArchives() {
    const input = readFileSync("./website/_data/archives.csv");
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

    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        // which file extensions to process
        extensions: "html,liquid",

        // optional, output image formats
        // formats: ["webp", "jpeg"],
        // formats: ["auto"],

        // optional, output image widths
        // widths: ["auto"],

        // optional, attributes assigned on <img> override these values.
        // defaultAttributes: {
        //     loading: "lazy",
        //     decoding: "async",
        // },
    });

    eleventyConfig.addPassthroughCopy('website/_data/files');
    eleventyConfig.addDataExtension("csv", (contents) => {
        const records = parse(contents, {
            columns: true,
            skip_empty_lines: true,
        });
        return records;
    });
    const archives = readArchives();

    for (const archive of archives) {
        const path = `archives/${archive.filename}.liquid`;
        eleventyConfig.addTemplate(path, archive.description, {
            layout: "archive.liquid",
            archive: archive,
        });
    }
};

