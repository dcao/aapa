import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import date from "lume/plugins/date.ts";
import wikilinks from "markdown-plugins/wikilinks.ts";
import backlinks from "./plugins/backlinks.ts";
import esbuild from "lume/plugins/esbuild.ts";

const markdown = {
    options: {
        linkify: true,
        typographer: true,
    },
};


const site = lume({
    src: "."
}, { markdown });

// const slug = createSlugifier();
const slug = (s: string) => s.toLowerCase();

site.use(esbuild());
site.use(tailwindcss());
site.use(date());

console.log("WARNING: wikilinks plugin doesn't support aliases!")
site.use(wikilinks({ slugify: slug }));

console.log("WARNING: backlinks detection doesn't work for files with spaces, and doesn't handle regular href links!")
console.log("WARNING: getting aliases to work with backlinks detection")
site.use(backlinks());

// Search and replace the wikilinks with the final URLs
console.log("WARNING: consider aliases when doing links!")
site.process([".html"], (pages) => {
    for (const page of pages) {
        // console.log(page.data.wikilinks)
        // Search all wikilinks in the page
        for (const link of page.document!.querySelectorAll("a[data-wikilink]")) {
            // Get the link id and remove the attribute
            const id = link.getAttribute("data-wikilink");
            // link.removeAttribute("data-wikilink");

            // Search a page with this id
            const found = pages.find((p) => {
                // console.log(p.data.basename, id)
                return slug(p.data.basename) === id;
            });

            if (found) {
                link.setAttribute("href", found.data.url);
                link.setAttribute("class", "wikilink valid")
            } else {
                link.setAttribute("title", "This page does not exist");
                link.setAttribute("class", "wikilink invalid")
            }
        }
    }
});

site.add("img/")
site.add("css/")
site.add("js/")
site.add("pages/")

export default site;
