---
'@ankhorage/zora': patch
---

Fix native GridView and GridInteractions gesture ownership. GridView no longer treats native scroll echoes of its own animated focus reveal as user pans, which could sustain an unbounded viewport and render loop in large SpatialGrid boards. GridInteractions now refuses responder termination requests and suspends ancestor ZORA ScrollView scrolling for the duration of an active native drag.
