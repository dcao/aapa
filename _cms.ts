import lumeCMS from "lume/cms/mod.ts";

const cms = lumeCMS();

// cms.git();

cms.upload({
    name: "images",
    store: "src:img",
});

// Use the cms instance to configure LumeCMS
cms.collection("pages", "src:pages/*.md", [
    "title: text",
    {
        name: "content",
        type: "markdown",
        upload: "images"
    },
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