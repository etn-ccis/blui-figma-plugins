/**
 Copyright (c) 2021-present, Eaton
 All rights reserved.
 This code is licensed under the BSD-3 license found in the LICENSE file in the root directory of this source tree and at https://opensource.org/licenses/BSD-3-Clause.
 **/

import { KEYS } from './shared';
import { fuzzyMatch } from './utils';

const DELIMITER = ',';
const EXPANDED_HEIGHT = 437;
const COLLAPSED_HEIGHT = 234;
const DEFAULT_WIDTH = 300;

figma.showUI(__html__, { themeColors: true, visible: false, width: DEFAULT_WIDTH, height: COLLAPSED_HEIGHT });

figma.clientStorage.getAsync(KEYS.PROPERTY_NAME).then((val) => {
    if (val) figma.ui.postMessage({ param: KEYS.PROPERTY_NAME, val });
});
figma.clientStorage.getAsync(KEYS.FROM_VARIANT).then((val) => {
    if (val !== undefined) figma.ui.postMessage({ param: KEYS.FROM_VARIANT, val });
});
figma.clientStorage.getAsync(KEYS.TO_VARIANT).then((val) => {
    if (val) figma.ui.postMessage({ param: KEYS.TO_VARIANT, val });
});
figma.clientStorage.getAsync(KEYS.DEEP_SWITCH).then((val) => {
    if (val) figma.ui.postMessage({ param: KEYS.DEEP_SWITCH, val });
});
figma.clientStorage.getAsync(KEYS.FULL_DOCUMENT).then((val) => {
    if (val) figma.ui.postMessage({ param: KEYS.FULL_DOCUMENT, val });
});
figma.clientStorage.getAsync(KEYS.EXACT_MATCH).then((val) => {
    if (val) figma.ui.postMessage({ param: KEYS.EXACT_MATCH, val });
});
figma.clientStorage.getAsync(KEYS.MAIN_COMPONENT_NAME).then((val) => {
    if (val) figma.ui.postMessage({ param: KEYS.MAIN_COMPONENT_NAME, val });
});
figma.clientStorage.getAsync(KEYS.SHOW_ADVANCED_OPTIONS).then((val) => {
    if (val !== undefined) {
        figma.ui.postMessage({ param: KEYS.SHOW_ADVANCED_OPTIONS, val });
        if (val) figma.ui.resize(DEFAULT_WIDTH, EXPANDED_HEIGHT);
    }
});

let switchCount = 0;

// show the UI when we finish initializing clientStorage
setTimeout(() => {
    figma.ui.show();
}, 250);

// to account for white space around the delimiter in figma
function trimPropertyWhiteSpace(str: string): string[] {
    return str.split(DELIMITER).map((prop) => prop.trim());
}

function traverse(
    node: any,
    propertyName: string,
    fromVariant: string,
    toVariant: string,
    deepSwitch: boolean,
    exactMatch: boolean,
    mainComponentName: string
) {
    // find an instance
    // the instance need to come from some kind of component set (i.e., has a parent)

    let parentSwapped = false;

    if (node && node.type == 'INSTANCE' && node.mainComponent.parent && node.variantProperties) {
        let nodeProperties = trimPropertyWhiteSpace(node.mainComponent.name);

        // the instance comes from a component with variances set in them
        // and there is the variant we are looking for

        let propertyIndex = -1;
        if (fromVariant !== '') {
            if (exactMatch) {
                propertyIndex = nodeProperties.indexOf(`${propertyName}=${fromVariant}`);
            } else {
                propertyIndex = nodeProperties.findIndex((property: string): boolean =>
                    fuzzyMatch(propertyName, fromVariant, property)
                );
            }
        } else {
            // the user didn't provide any fromVariant
            // changing all instances with the "propertyName" property to "toVariant"
            if (exactMatch) {
                propertyIndex = nodeProperties.findIndex((property: string): boolean =>
                    property.startsWith(`${propertyName}=`)
                );
            } else {
                propertyIndex = nodeProperties.findIndex((property: string): boolean =>
                    fuzzyMatch(propertyName, '', property)
                );
            }
        }

        // do not swap if somehow the instance is already on the "toVariant"
        let isOnToVariant = false;
        if (exactMatch) {
            isOnToVariant = node.variantProperties[propertyName] === toVariant;
        } else {
            isOnToVariant =
                nodeProperties.findIndex((property: string): boolean =>
                    fuzzyMatch(propertyName, toVariant, property)
                ) !== -1;
        }

        // do the swapping
        if (
            (mainComponentName !== '' && mainComponentName === node.mainComponent.parent.name) ||
            mainComponentName === ''
        ) {
            if (node.mainComponent.parent.type === 'COMPONENT_SET' && propertyIndex !== -1 && !isOnToVariant) {
                let changeToSibling: ComponentNode;
                if (exactMatch) {
                    nodeProperties[propertyIndex] = `${propertyName}=${toVariant}`;
                    changeToSibling = node.mainComponent.parent.findChild(
                        (sibling: ComponentNode) =>
                            trimPropertyWhiteSpace(sibling.name).join(DELIMITER) === nodeProperties.join(DELIMITER)
                    );
                } else {
                    const nodePropertiesJSON = { ...node.variantProperties };
                    changeToSibling = node.mainComponent.parent.findChild((sibling: ComponentNode): boolean => {
                        const siblingNodeProperties = trimPropertyWhiteSpace(sibling.name);
                        if (fuzzyMatch(propertyName, toVariant, siblingNodeProperties[propertyIndex])) {
                            const propertyToChange = siblingNodeProperties[propertyIndex].split('=')[0].trim();
                            nodePropertiesJSON[propertyToChange] = sibling.variantProperties[propertyToChange];
                            return JSON.stringify(nodePropertiesJSON) === JSON.stringify(sibling.variantProperties);
                        } else {
                            return false;
                        }
                    });
                }
                // we found a sibling with the property swapped out
                if (changeToSibling) {
                    node.swapComponent(changeToSibling);
                    parentSwapped = true;
                    switchCount++;
                }
                // we couldn't find a good sibling with the exact property,
                // but try again to find at least one with the property we care about
                else {
                    changeToSibling = node.mainComponent.parent.findChild(
                        (sibling: ComponentNode) => sibling.variantProperties[propertyName] === toVariant
                    );

                    if (changeToSibling) {
                        node.swapComponent(changeToSibling);
                        parentSwapped = true;
                        switchCount++;
                    }
                }
            }
        }
    }
    // now that we are done swapping, look to see if any child component is swappable
    // if deepSwitch is checked and parent is swapped, we don't want to look further in this layer tree
    if ('children' in node && (deepSwitch || !parentSwapped)) {
        for (const child of node.children) {
            traverse(child, propertyName, fromVariant, toVariant, deepSwitch, exactMatch, mainComponentName);
        }
    }
}

figma.ui.onmessage = (msg) => {
    if (msg.action === 'submit') {
        // remember these params and save to client storage
        figma.clientStorage.setAsync(KEYS.PROPERTY_NAME, msg.propertyName);
        figma.clientStorage.setAsync(KEYS.FROM_VARIANT, msg.fromVariant);
        figma.clientStorage.setAsync(KEYS.TO_VARIANT, msg.toVariant);
        figma.clientStorage.setAsync(KEYS.DEEP_SWITCH, msg.deepSwitch);
        figma.clientStorage.setAsync(KEYS.FULL_DOCUMENT, msg.fullDocument);
        figma.clientStorage.setAsync(KEYS.EXACT_MATCH, msg.exactMatch);
        figma.clientStorage.setAsync(KEYS.MAIN_COMPONENT_NAME, msg.mainComponentName);
        figma.clientStorage.setAsync(KEYS.SHOW_ADVANCED_OPTIONS, msg.showAdvancedOptions);

        // the user want to switch the whole document
        if (msg.fullDocument === 'true') {
            for (const pageNode of figma.root.children) {
                traverse(
                    pageNode,
                    msg.propertyName,
                    msg.fromVariant,
                    msg.toVariant,
                    msg.deepSwitch === 'true',
                    msg.exactMatch === 'true',
                    msg.mainComponentName
                );
            }
        }
        // the user selected something, then we look at the selection
        else if (figma.currentPage.selection.length) {
            for (const node of figma.currentPage.selection) {
                traverse(
                    node,
                    msg.propertyName,
                    msg.fromVariant,
                    msg.toVariant,
                    msg.deepSwitch === 'true',
                    msg.exactMatch === 'true',
                    msg.mainComponentName
                );
            }
        }
        // the user didn't select anything, then let's change the entire page
        else {
            traverse(
                figma.currentPage,
                msg.propertyName,
                msg.fromVariant,
                msg.toVariant,
                msg.deepSwitch === 'true',
                msg.exactMatch === 'true',
                msg.mainComponentName
            );
        }

        // display snackbar message with ellipsis, so that it looks less awkward when exact match is off
        const notifyPropertyName = msg.exactMatch === 'true' ? msg.propertyName : `...${msg.propertyName}...`;
        const notifyToVariant = msg.exactMatch === 'true' ? msg.toVariant : `...${msg.toVariant}...`;

        // snackbar feedback
        if (switchCount === 0) {
            if (msg.mainComponentName !== '') {
                figma.notify(
                    `😕 Variant Switcher couldn't find any "${msg.mainComponentName}" to switch to "${notifyPropertyName}=${notifyToVariant}".`
                );
            } else {
                figma.notify(
                    `😕 Variant Switcher couldn't find anything to switch to "${notifyPropertyName}=${notifyToVariant}".`
                );
            }
        } else if (switchCount === 1) {
            figma.notify(`Changed 1 instance's "${notifyPropertyName}" to "${notifyToVariant}".`);
        } else {
            figma.notify(`Changed ${switchCount} instances' "${notifyPropertyName}" to "${notifyToVariant}".`);
        }
        figma.closePlugin();
    } else if (msg.action === 'resize') {
        if (msg.showAdvancedOptions) {
            figma.ui.resize(DEFAULT_WIDTH, EXPANDED_HEIGHT);
        } else {
            figma.ui.resize(DEFAULT_WIDTH, COLLAPSED_HEIGHT);
        }
    }
};
