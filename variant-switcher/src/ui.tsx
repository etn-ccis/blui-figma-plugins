/**
 Copyright (c) 2021-present, Eaton
 All rights reserved.
 This code is licensed under the BSD-3 license found in the LICENSE file in the root directory of this source tree and at https://opensource.org/licenses/BSD-3-Clause.
 **/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { KEYS } from './shared';
import { Exchange } from './icons/index';
import './ui.css';

declare function require(path: string): any;

const LOCAL_STORAGE_DATA = {};
onmessage = (event) => {
    LOCAL_STORAGE_DATA[event.data.pluginMessage.param] = event.data.pluginMessage.val;
};

const App: React.FC = () => {
    // basic options
    const [propertyName, setPropertyName] = React.useState('Theme');
    const [fromVariant, setFromVariant] = React.useState('Light');
    const [toVariant, setToVariant] = React.useState('Dark');

    // advanced options
    const [deepSwitch, setDeepSwitch] = React.useState<'true' | 'false'>('false');
    const [fullDocument, setFullDocument] = React.useState<'true' | 'false'>('false');
    const [mainComponentName, setMainComponentName] = React.useState('');

    // load stored parameters from history
    // use a timer to help picking up the async update from onmessage
    React.useEffect(() => {
        const timerPropertyName = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.PROPERTY_NAME]) {
                setPropertyName(LOCAL_STORAGE_DATA[KEYS.PROPERTY_NAME]);
                clearInterval(timerPropertyName);
            }
        }, 50);
        const timerFromVariant = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.FROM_VARIANT] !== undefined) {
                setFromVariant(LOCAL_STORAGE_DATA[KEYS.FROM_VARIANT]);
                clearInterval(timerFromVariant);
            }
        }, 50);
        const timerToVariant = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.TO_VARIANT]) {
                setToVariant(LOCAL_STORAGE_DATA[KEYS.TO_VARIANT]);
                clearInterval(timerToVariant);
            }
        }, 50);
        const timerDeepSwitch = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.DEEP_SWITCH]) {
                setDeepSwitch(LOCAL_STORAGE_DATA[KEYS.DEEP_SWITCH]);
                clearInterval(timerDeepSwitch);
            }
        }, 50);
        const timerFullDocument = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.FULL_DOCUMENT]) {
                setFullDocument(LOCAL_STORAGE_DATA[KEYS.FULL_DOCUMENT]);
                clearInterval(timerFullDocument);
            }
        }, 50);
        const timerMainComponentName = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.MAIN_COMPONENT_NAME]) {
                setMainComponentName(LOCAL_STORAGE_DATA[KEYS.MAIN_COMPONENT_NAME]);
                clearInterval(timerMainComponentName);
            }
        }, 50);
        return () => {
            clearInterval(timerPropertyName);
            clearInterval(timerFromVariant);
            clearInterval(timerToVariant);
            clearInterval(timerDeepSwitch);
            clearInterval(timerFullDocument);
            clearInterval(timerMainComponentName);
        };
    }, []);

    // submit iff input fields are valid
    const submit = React.useCallback(() => {
        if (propertyName !== '' && toVariant !== '') {
            parent.postMessage(
                {
                    pluginMessage: {
                        propertyName,
                        fromVariant,
                        toVariant,
                        deepSwitch,
                        fullDocument,
                        mainComponentName,
                    },
                },
                '*'
            );
        }
    }, [propertyName, fromVariant, toVariant, deepSwitch, fullDocument, mainComponentName]);

    return (
        <div>
            <div className={'input-row'}>
                <label>Property Name</label>
                <input
                    onChange={(e) => setPropertyName(e.target.value)}
                    name={'Name of the property shared by instances'}
                    value={propertyName}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            submit();
                        }
                    }}
                />
            </div>
            <div className={'input-row'}>
                <label>From Variant</label>{' '}
                <input
                    onChange={(e) => setFromVariant(e.target.value)}
                    name={'The variant name to change from'}
                    value={fromVariant}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            submit();
                        }
                    }}
                />
            </div>
            <div className={'input-row'}>
                <label>To Variant</label>
                <input
                    onChange={(e) => setToVariant(e.target.value)}
                    name={'The variant name to change into'}
                    value={toVariant}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            submit();
                        }
                    }}
                />
            </div>
            <div className={'checkbox-row'}>
                <input
                    type={'checkbox'}
                    onChange={(e) => {
                        setDeepSwitch(e.target.value === 'true' ? 'false' : 'true');
                    }}
                    name={'swapChild'}
                    value={deepSwitch}
                    checked={deepSwitch === 'true'}
                />
                <div
                    onClick={(e) => {
                        setDeepSwitch(deepSwitch === 'true' ? 'false' : 'true');
                    }}
                >
                    <label htmlFor={'swapChild'} title={'Look into child layers after parent instances are switched'}>
                        Deep Switch
                    </label>
                    <div className={'hint-text'}>
                        {deepSwitch === 'true' ? (
                            <span>Plugin will switch all instances in the selected tree</span>
                        ) : (
                            <span>Plugin will not switch children after switching parent instance</span>
                        )}
                    </div>
                </div>
            </div>
            <div className={'checkbox-row'}>
                <input
                    type={'checkbox'}
                    onChange={(e) => {
                        setFullDocument(e.target.value === 'true' ? 'false' : 'true');
                    }}
                    name={'fullDocumentSwitch'}
                    value={fullDocument}
                    checked={fullDocument === 'true'}
                />
                <div
                    onClick={(e) => {
                        setFullDocument(fullDocument === 'true' ? 'false' : 'true');
                    }}
                >
                    <label htmlFor={'fullDocumentSwitch'} title={'Look into the entire document'}>
                        Switch Full Document
                    </label>
                    <div className={'hint-text'}>
                        {fullDocument === 'true' ? (
                            <span>Plugin will scan through all pages in the current document</span>
                        ) : (
                            <span>Plugin will only scan the current selection</span>
                        )}
                    </div>
                </div>
            </div>
            <div className={'input-row'}>
                <label title={'Only check instance with this main component name'}>Main Component Name</label>
                <input
                    onChange={(e) => setMainComponentName(e.target.value)}
                    name={'Main component name'}
                    value={mainComponentName}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            submit();
                        }
                    }}
                />
            </div>

            <div id={'exchange-icon-container'}>
                <button
                    id={'exchange-icon'}
                    onClick={() => {
                        const temp = fromVariant;
                        setFromVariant(toVariant);
                        setToVariant(temp);
                    }}
                >
                    {<Exchange />}
                </button>
            </div>

            <div className={'button-row'}>
                <button className={'secondary'} onClick={submit} disabled={propertyName === '' || toVariant === ''}>
                    Advanced ...
                </button>
                <button className={'primary'} onClick={submit}>
                    Switch Variant
                </button>
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('react-page'));
