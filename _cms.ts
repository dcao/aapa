import lumeCMS from "lume/cms/mod.ts";

const cms = lumeCMS();

// Use the cms instance to configure LumeCMS
cms.collection("posts", "src:ask/*.md", [
    "layout: hidden",
    "title: text",
    "content: markdown",
    "tags: list",
    "date: date",
]);

cms.auth({
    admin: {
        password: "admin",
        name: "Admin",
    },
});

export default cms;