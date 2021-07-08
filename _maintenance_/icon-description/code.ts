/**
 * Choose to update material icons or pxb icons.
 * Updating both at the same time would result in name conflict.
 */
const UPDATE_MATERIAL = true;

const PXBLUE_META = 'https://raw.githubusercontent.com/pxblue/icons/master/svg/index.json';

// const matJSON = require('./matMeta');

import { data } from './matMeta.js';
console.log('data!', data);

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
        console.log(data);
        const iconSet = data;
        // updateIcons(iconSet);
    }
    figma.ui.postMessage({ url: PXBLUE_META, updateMaterial: UPDATE_MATERIAL });
}

function addDescriptionToIconNode(node, icons: IconSet): void {
    if (node && node.type === 'COMPONENT') {
        if (node.description === undefined || node.description === '') {
            iconsWithoutTags.push(node.name);
        }
        // find a node, let's see if it is an icon
        if (Object.keys(icons).includes(node.name)) {
            // bingo, it is a recognized icon.

            const newDescription = icons[node.name].join(', ');

            if (newDescription !== node.description) {
                node.description = newDescription;
                updateCount++;
            }
            // remove it from the set to speed up the search, and also to avoid fights between dup names in pxb and mat icons
            icons[node.name] = undefined;
        } else {
            // user selected something whose name cannot be recognized by the plugin
            iconsNotInMeta.push(node.name);
        }
    }
}

function updateIcons(iconSet: IconSet) {
    console.log(iconSet);
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
        console.log("These icons showed up in meta files, but didn't have anything in the tags field:");
        console.log(iconsWithoutTags);
    }
    if (iconsNotInMeta.length !== 0) {
        console.log('These icons exist in your selection, but are not in the meta files:');
        console.log(iconsNotInMeta);
    }
    figma.closePlugin();
}

figma.ui.onmessage = (msg: IconSet) => {
    updateIcons(msg);
};
