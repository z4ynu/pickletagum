# Court images

Court photos are uploaded through the private `/admin` editor and stored in the public Supabase `court-images` bucket. This folder is kept only for optional static site assets.

```json
"image": {
  "src": "/images/courts/the-lob.jpg",
  "alt": "The four outdoor pickleball courts at The LOB"
}
```

Use a landscape photo (roughly 3:2), compress it before committing, and only use images the directory has permission to display. Until an image is supplied, the site shows an explicit “Venue photo coming soon” preview instead of a misleading stock image.
