# Generic Slab

For consistency (and your own convenience!), almost all Organisms should `include` this piece. Among other things, it:

- sets the theme (if a `theme` is passed in) and corresponding background-color and text-color;
- selectively applies component-level vertical-margins, vertical-paddings, and containers in a "smart" way (i.e., the mechanism is sensitive to the value of `theme`, and it applies these properties so that they'll be "undone" in certain circumstances when they should be);
- accepts common Organism-properties (`heading`, `fancyLinkList`, and `editorial`, at the time of writing) and standardizes their positions and vertical spacing.

The `GenericSlab` can also be used to "convert" an atom or molecule into an organism (in case a one-off scenario calls for it and you don't feel like making a whole separate component for the purpose).
