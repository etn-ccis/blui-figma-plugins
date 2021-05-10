import { KEYS } from './shared';
figma.showUI(__html__, { visible: false });

const delimiter = ', ';

figma.clientStorage.getAsync(KEYS.PROPERTY_NAME).then((val) => {
    if (val) figma.ui.postMessage({ param: KEYS.PROPERTY_NAME, val });
});
figma.clientStorage.getAsync(KEYS.FROM_VARIANT).then((val) => {
    if (val !== undefined) figma.ui.postMessage({ param: KEYS.FROM_VARIANT, val });
});
figma.clientStorage.getAsync(KEYS.TO_VARIANT).then((val) => {
    if (val) figma.ui.postMessage({ param: KEYS.TO_VARIANT, val });
});

// show the UI when we finish initializing clientStorage
setTimeout(() => {
    figma.ui.show();
}, 150);

function traverse(node: any, propertyName: string, fromVariant: string, toVariant: string) {
    // find an instance
    // the instance need to come from some kind of component set (i.e., has a parent)
    if (node && node.type == 'INSTANCE' && node.mainComponent.parent) {
        let nodeProperties = node.mainComponent.name.split(delimiter);

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
        if (node.mainComponent.parent.type === 'COMPONENT_SET' && propertyIndex !== -1) {
            nodeProperties[propertyIndex] = `${propertyName}=${toVariant}`;
            let changeToSibling = node.mainComponent.parent.findChild(
                (sibling: ComponentNode) => sibling.name === nodeProperties.join(delimiter)
            );
            // we found a sibling with the property swapped out
            if (changeToSibling) {
                node.swapComponent(changeToSibling);
            }
            // we couldn't find a good sibling with the exact property,
            // but try again to find at least one with the property we care about
            else {
                changeToSibling = node.mainComponent.parent.findChild((sibling: ComponentNode) =>
                    sibling.name.split(delimiter).includes(`${propertyName}=${toVariant}`)
                );

                if (changeToSibling) {
                    node.swapComponent(changeToSibling);
                }
            }
        }
    }
    // now that we are done swapping, look to see if any child component is swappable
    if ('children' in node) {
        for (const child of node.children) {
            traverse(child, propertyName, fromVariant, toVariant);
        }
    }
}

figma.ui.onmessage = (msg) => {
    // remember these params and save to client storage
    figma.clientStorage.setAsync(KEYS.PROPERTY_NAME, msg.propertyName);
    figma.clientStorage.setAsync(KEYS.FROM_VARIANT, msg.fromVariant);
    figma.clientStorage.setAsync(KEYS.TO_VARIANT, msg.toVariant);

    // if user selected something, then we look at the selection
    if (figma.currentPage.selection.length) {
        for (const node of figma.currentPage.selection) {
            traverse(node, msg.propertyName, msg.fromVariant, msg.toVariant);
        }
    }
    // the user didn't select anything, then let's change the entire page
    else {
        traverse(figma.currentPage, msg.propertyName, msg.fromVariant, msg.toVariant);
    }
    figma.closePlugin();
};
