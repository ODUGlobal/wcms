# Data Model Outline

A list of Drupal entities and fields.

## Entites

Entitites are the building blocks of Drupal. Blocks, Content types, Media types, and Taxonomy vocabularies are available in Drupal Core, and others may be added with contributor or custom modules.

## Fields

Each entity can reference any number of fields. Fields may contain simple data such as a number or plain text, or be a reference to an entity. Fields can, and in most cases should be re-used across each category of entity. Drupal core provides a large selection of fields, and more can be added with contributor or custom modules.

## Complexity tax

Entities are actually tables in the database. Fields are stored in their own table and referenced by entities. The more entities in a project, the greater the hit on performance.

The other cost is realized during Drupal updates. Contributor and custom modules must be tested for compatibiltiy with the latest release. An incomptible module may hold a project back from major version updates. Custom module will require additional development to remain up-to-date.

### Blocks

1. Basic block (basic)
   1. Body (body) - Text (formatted, long, with summary)

### Content types (nodes)

1. Basic page (page)
   1. Body (body) - Text (formatted, long, with summary)
2. Flex page (flex_page)
   1. Paragraphs (field_paragraphs) - Entity reference revisions (Paragraph) \*
      1. Paragraph types
         1. include all

### Media types

1. Audio (audio)
   1. Audio file (field_media_audio_file) - File
      1. Required
      2. Allowed file extensions: mp3, wav, aac
      3. File directory: [date:custom:Y]-[date:custom:m]
2. Document (document)
   1. Document (field_media_document) - File
      1. Required
      2. Allowed file extensions: txt, rtf, doc, docx, ppt, pptx, xls, xlsx, pdf, odf, odg, odp, ods, odt, fodt, fods, fodp, fodg, key, numbers, pages
      3. File directory: [date:custom:Y]-[date:custom:m]
3. Image (iamge)
   1. Image (field_media_image) - File
      1. Required
      2. Allowed file extensions: png, gif, jpg, jpeg
      3. File directory: [date:custom:Y]-[date:custom:m]
      4. Maximum image resolution:
      5. Minimum image resolution:
      6. Maximum upload size
      7. Enable _Alt_ field
      8. _Alt_ field required
4. Remote video (remote_video)
   1. Tumbnail location: public://oembed_thumbnails/[date:custom:Y-m]
   2. Allowed provoders
      1. YouTube
      2. Vimeo
   3. Video URL (field_media_oembed_video) - Text (plain)
      1. Required
5. Video (video)
   1. Video file (field_media_video_file) - File
      1. Required
      2. Allowed file extensions: mp4
      3. File directory: [date:custom:Y]-[date:custom:m]
      4. Maximum upload size:

### Taxonomy vocabularies

1. Tags (tags)

### Paragraph types \*

1. Body (paragrph_body)
   1. Body (field) - Text (formatted, long)
      1. Required
2. Call to action (call-to-action)
   1. Headline (field_headline) - Text (plain)
   2. Image (field_iamge) - Entity reference (Media)
      1. Media type
         1. Image
   3. Link (field_link) - Link
      1. Required
      2. Allowed link type: Both internal and external
      3. Allowed link text: Required
3. Testimonial (testimonial)
   1. Attribution (field_attribution) - Text (formatted)
   2. Quote (field_quote) - Text (formatted, long)
      1. Required

\* requires contributor (contrib) module  
\*\* requires custom module
