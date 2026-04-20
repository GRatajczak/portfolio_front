import {defineConfig, defineField, defineType} from "sanity";
import {structureTool} from "sanity/structure";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || "your-project-id";
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";

const postType = defineType({
    name: "post",
    title: "Post",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {source: "title"},
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "excerpt",
            title: "Excerpt",
            type: "text",
            rows: 3,
        }),
        defineField({
            name: "publishedAt",
            title: "Published at",
            type: "datetime",
        }),
    ],
});

export default defineConfig({
    name: "default",
    title: "Portfolio Studio",
    projectId,
    dataset,
    plugins: [structureTool()],
    schema: {
        types: [postType],
    },
});
