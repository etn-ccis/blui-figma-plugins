# Variant Switcher

![Banner](../_assets_/variant-switcher/cover-art.svg)

The Variant Switcher plugin takes all of your selected component instances and recursively changes them to a different variant based on the specified property.

## Usage

The Variant Switcher plugin has three input fields:

| Input Field                     | Description                                                                                                                           | Required? |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Property Name                   | the property you want to change                                                                                                       | yes       |
| From Variant                    | the current value you want to target (leave blank to select all instances with the selected property regardless of the current value) | no        |
| To Variant                      | the new value you want to set the property to                                                                                         | yes       |

## Example

![Example](../_assets_/variant-switcher/example.png)

Consider the example above. In this case, all of the components have a `Theme` property (all of them have a "Light" and "Dark" variant and the Star has an additional "Blue" variant). When using the plugin, we set the `Property Name` field to "Theme", `From Variant` to "Light", and `To Variant` to "Dark". The plugin traverses through all selected nodes finding any instances whose `Theme` properties are set to "Light", and changes them to "Dark".

> Notice that the Star component was unchanged because the current value of its `Theme` property was "Blue", not "Light". If we had left the "From Variant" field blank, then the Star would have also been changed because the plugin would select all nodes with the `Theme` property regardless of the current value.


## Running Plugin Locally (For Developers)

To run the plugin locally, first clone the repository:
```sh
git clone https://github.com/pxblue/figma-plgins
```

Then, link the plugin to Figma:
-   Open the Figma desktop app  and in the toolbar go to `Plugins > Development > New Plugin`. 
-   In the dialog box, under "Link existing plugin" either click the box to select a file or drag and drop into the dotted box.
    -   Use the `manifest.json` file from the repo you just cloned.

Finally, build the plugin:

```sh
cd path/to/figma-plugins/variant-switcher
yarn && npx webpack
```

The plugin should now be running happily.

> To build in production mode, run `npx webpack --mode production`. See results in `/dist` folder.
