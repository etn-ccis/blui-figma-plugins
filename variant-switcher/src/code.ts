figma.showUI(__html__);

const delimiter = ', ';

function traverse(node: any, propertyName: string, fromVariant: string, toVariant: string) {
    // find an instance instance
    if (node.type == 'INSTANCE') {
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
