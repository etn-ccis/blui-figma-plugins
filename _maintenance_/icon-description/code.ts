/**
 * Choose to update material icons or brightlayer-ui icons.
 * Updating both at the same time would result in name conflict.
 */
const UPDATE_MATERIAL = true;

const BRIGHTLAYER_UI_META = 'https://raw.githubusercontent.com/brightlayer-ui/icons/master/svg/index.json';

type IconSet = { [name: string]: string[] };

// count the icon description status
let updateCount = 0;
const iconsWithoutTags: string[] = [];
const iconsNotInMeta: string[] = [];

if (!figma.currentPage.selection.length) {
    figma.notify(`Select the icons before you run the plugin.`);
    figma.closePlugin();
} else if (figma.currentPage.selection[0].type !== 'COMPONENT') {
    figma.notify(`Do not select anything else other than the icons.`);
    figma.closePlugin();
} else {
    // create a fake UI and send the network request
    figma.showUI(__html__, { visible: false });
    if (UPDATE_MATERIAL) {
        // couldn't find a proper way to import the json
        // @ts-ignore
        const iconSet = matIconSet;
        updateIcons(iconSet);
    } else {
        figma.ui.postMessage({ url: BRIGHTLAYER_UI_META });
    }
}

function addDescriptionToIconNode(node, icons: IconSet): void {
    if (node && node.type === 'COMPONENT') {
        // find a node, let's see if it is an icon
        if (icons[node.name] !== undefined) {
            // bingo, it is a recognized icon.

            // the tags are "[]" in the meta file
            if (icons[node.name].length === 0) {
                iconsWithoutTags.push(node.name);
            } else {
                // there are some tags in the meta file, add them to the description
                const newDescription = icons[node.name].join(', ');

                if (newDescription !== node.description) {
                    node.description = newDescription;
                    updateCount++;
                }
                // remove it from the set to speed up the search, and also to avoid fights between dup names in brightlayer-ui and mat icons
                icons[node.name] = undefined;
            }
        } else {
            // user selected something whose name cannot be recognized by the plugin
            iconsNotInMeta.push(node.name);
        }
    }
}

function updateIcons(iconSet: IconSet) {
    if (figma.currentPage.selection.length) {
        for (const node of figma.currentPage.selection) {
            addDescriptionToIconNode(node, iconSet);
        }
    }

    // snackbar feedback
    if (updateCount === 0) {
        figma.notify(`😕 I couldn't find any icons to update.`);
    } else if (updateCount === 1) {
        figma.notify(`Changed 1 icon's description.`);
    } else {
        figma.notify(`Changed ${updateCount} icons' description.`);
    }

    if (iconsWithoutTags.length !== 0) {
        console.log(
            "These icons showed up in meta files, but their 'tags' field are empty, and therefore the plugin didn't touch anything to them:"
        );
        console.log(iconsWithoutTags);
    }
    if (iconsNotInMeta.length !== 0) {
        console.log(
            `[!!] These icons exist in your selection, but are not in the meta files, and therefore the plugin didn't touch anything to them:`
        );
        console.log(iconsNotInMeta);
    }
    figma.closePlugin();
}

figma.ui.onmessage = (msg: IconSet) => {
    updateIcons(msg);
};
