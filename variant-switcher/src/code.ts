import { KEYS } from './shared';
figma.showUI(__html__, { visible: false, height: 265 });

const delimiter = ',';

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

let switchCount = 0;

// show the UI when we finish initializing clientStorage
setTimeout(() => {
    figma.ui.show();
}, 250);

function traverse(node: any, propertyName: string, fromVariant: string, toVariant: string, deepSwitch: boolean) {
    // find an instance
    // the instance need to come from some kind of component set (i.e., has a parent)

    let parentSwapped = false;

    if (node && node.type == 'INSTANCE' && node.mainComponent.parent) {
        let nodeProperties = node.mainComponent.name.split(delimiter).map((str: string) => str.trim());

        // the instance comes from a component with variances set in them
        // and there is the variant we are looking for

        let propertyIndex = -1;
        if (fromVariant !== '') {
            propertyIndex = nodeProperties.indexOf(`${propertyName}=${fromVariant}`);
        } else {
            // the user didn't provide any fromVariant
            // changing all instances with the "propertyName" property to "toVariant"
            propertyIndex = nodeProperties.findIndex((property: string): boolean =>
                property.startsWith(`${propertyName}=`)
            );
        }

        // do not swap if somehow the instance is already on the "toVariant"
        const isOnToVariant = nodeProperties.indexOf(`${propertyName}=${toVariant}`) !== -1;

        // do the swapping
        if (node.mainComponent.parent.type === 'COMPONENT_SET' && propertyIndex !== -1 && !isOnToVariant) {
            nodeProperties[propertyIndex] = `${propertyName}=${toVariant}`;
            let changeToSibling = node.mainComponent.parent.findChild(
                (sibling: ComponentNode) => sibling.name === nodeProperties.join(delimiter)
            );
            // we found a sibling with the property swapped out
            if (changeToSibling) {
                node.swapComponent(changeToSibling);
                parentSwapped = true;
                switchCount++;
            }
            // we couldn't find a good sibling with the exact property,
            // but try again to find at least one with the property we care about
            else {
                changeToSibling = node.mainComponent.parent.findChild((sibling: ComponentNode) =>
                    sibling.name.split(delimiter).includes(`${propertyName}=${toVariant}`)
                );

                if (changeToSibling) {
                    node.swapComponent(changeToSibling);
                    parentSwapped = true;
                    switchCount++;
                }
            }
        }
    }
    // now that we are done swapping, look to see if any child component is swappable
    // if deepSwitch is checked and parent is swapped, we don't want to look further in this layer tree
    if ('children' in node && (deepSwitch || !parentSwapped)) {
        for (const child of node.children) {
            traverse(child, propertyName, fromVariant, toVariant, deepSwitch);
        }
    }
}

figma.ui.onmessage = (msg) => {
    // remember these params and save to client storage
    figma.clientStorage.setAsync(KEYS.PROPERTY_NAME, msg.propertyName);
    figma.clientStorage.setAsync(KEYS.FROM_VARIANT, msg.fromVariant);
    figma.clientStorage.setAsync(KEYS.TO_VARIANT, msg.toVariant);
    figma.clientStorage.setAsync(KEYS.DEEP_SWITCH, msg.deepSwitch);

    // if user selected something, then we look at the selection
    if (figma.currentPage.selection.length) {
        for (const node of figma.currentPage.selection) {
            traverse(node, msg.propertyName, msg.fromVariant, msg.toVariant, msg.deepSwitch === 'true');
        }
    }
    // the user didn't select anything, then let's change the entire page
    else {
        traverse(figma.currentPage, msg.propertyName, msg.fromVariant, msg.toVariant, msg.deepSwitch === 'true');
    }

    // snackbar feedback
    if (switchCount === 0) {
        figma.notify(`😕 Variant Switcher couldn't find anything to switch to "${msg.propertyName}=${msg.toVariant}".`);
    } else if (switchCount === 1) {
        figma.notify(`Changed 1 instance's "${msg.propertyName}" to "${msg.toVariant}".`);
    } else {
        figma.notify(`Changed ${switchCount} instances' "${msg.propertyName}" to "${msg.toVariant}".`);
    }
    figma.closePlugin();
};
