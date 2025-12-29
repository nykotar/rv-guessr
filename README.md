# rv-guessr

This project is a proof-of-concept Remote Viewing game inspired by the popular game [GeoGuessr](https://geoguessr.com). Players are given a hidden target corresponding to a randomly selected location anywhere on the globe. Using a remote viewing technique or personal strategy, the viewer conducts a session to gather impressions and clues about the target’s geographic characteristics.
Based on these impressions, the player marks a location on an interactive map. The target is then revealed, allowing the player to see how close their estimate was. The project is intended as an experimental and exploratory tool rather than a validation of remote viewing, focusing on gameplay, intuition, and user experience. 
  
As a proof of concept, the primary focus was on validating the core idea rather than code quality, architectural rigor, or comprehensive testing. As a result, the codebase may be unpolished and is not yet optimized for maintainability or scalability. Additionally, the user interface has not been thoroughly adapted for different screen sizes and may not function correctly on smaller displays or mobile devices.
  
## Technical Details

The target locations consist of points of interest scraped from OpenStreetMap and filtered to exclude government facilities, NSFW locations, and other sensitive or inappropriate sites. Each point of interest is then matched with its corresponding Wikipedia page, providing contextual information associated with the target. The data collection and matching process was largely automated. The quality of individual targets may vary, and despite filtering efforts, some locations or associated content may not fully meet the intended criteria. Additionally, the dataset is relatively large and may affect page load performance.

# Running locally

1. Clone the project
2. Install dependencies with `pnpm install`
3. Run with `pnpm run dev`