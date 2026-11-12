---
'@ankhorage/zora': major
---

Remove the obsolete `ankh zora create` and `ankh zora sync` materialization workflow. Standalone
Web-only consumers import published `@ankhorage/zora/web/*` subpaths directly instead of copying
package artifacts into project-local aliases.
