# Icon Description

By default, this maintenance plugin will update the "description" field for each selected icon using the array of tags supplied in meta files. It will also output some useful information in Figma's developer console.

## For Maintainers

The developer functionality only works through Figma desktop app.

To sync up to Material Design and Brightlayer UI's latest icon meta file, open Component Stickersheet's icon page (I suggest doing this from a [Figma branch](https://help.figma.com/hc/en-us/articles/360063144053-Create-branches-and-merge-changes)), and link to this plugin's `manifest.json`. Observe that the plugin shows up under "Plugin > Development > Icon Description" in Figma.

**To update Material Design icons:** You will need to do `yarn && yarn build`, select those Material icon components you would like to update, and run the plugin.

**To update Brightlayer UI icons:** Make sure [the meta data at Brightlayer UI master branch](https://github.com/etn-ccis/blui-icons/blob/master/svg/index.json) is up-to-date.
Then change line 5 of `code.ts` to `false` and run `yarn && yarn build`. After that, select those Brightlayer UI icon components you would want to update, and run the plugin.

Both Material and Brightlayer UI's meta data is updated every time you run `yarn build`.
