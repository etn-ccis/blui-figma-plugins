/**
 Copyright (c) 2021-present, Eaton
 All rights reserved.
 This code is licensed under the BSD-3 license found in the LICENSE file in the root directory of this source tree and at https://opensource.org/licenses/BSD-3-Clause.
 **/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { KEYS } from './shared';
import { Exchange, Dropdown } from './icons/index';
import './ui.css';

declare function require(path: string): any;

const LOCAL_STORAGE_DATA = {};
onmessage = (event) => {
    LOCAL_STORAGE_DATA[event.data.pluginMessage.param] = event.data.pluginMessage.val;
};

const App: React.FC = () => {
    // the states set here will be the default state a first time plugin user gets
    // basic options
    const [propertyName, setPropertyName] = React.useState('Theme');
    const [fromVariant, setFromVariant] = React.useState('Light');
    const [toVariant, setToVariant] = React.useState('Dark');

    // advanced options
    const [deepSwitch, setDeepSwitch] = React.useState<'true' | 'false'>('false');
    const [fullDocument, setFullDocument] = React.useState<'true' | 'false'>('false');
    const [exactMatch, setExactMatch] = React.useState<'true' | 'false'>('true');
    const [pluginStayOpen, setPluginStayOpen] = React.useState<'true' | 'false'>('false');
    const [mainComponentName, setMainComponentName] = React.useState('');

    const [showAdvancedOptions, setShowAdvancedOptions] = React.useState(false);

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
        const timerExactMatch = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.EXACT_MATCH]) {
                setExactMatch(LOCAL_STORAGE_DATA[KEYS.EXACT_MATCH]);
                clearInterval(timerExactMatch);
            }
        }, 50);
        const timerPluginStayOpen = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.PLUGIN_STAY_OPEN]) {
                setExactMatch(LOCAL_STORAGE_DATA[KEYS.PLUGIN_STAY_OPEN]);
                clearInterval(timerPluginStayOpen);
            }
        }, 50);
        const timerMainComponentName = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.MAIN_COMPONENT_NAME]) {
                setMainComponentName(LOCAL_STORAGE_DATA[KEYS.MAIN_COMPONENT_NAME]);
                clearInterval(timerMainComponentName);
            }
        }, 50);
        const timerShowAdvancedOptions = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.SHOW_ADVANCED_OPTIONS]) {
                setShowAdvancedOptions(LOCAL_STORAGE_DATA[KEYS.SHOW_ADVANCED_OPTIONS]);
                clearInterval(timerShowAdvancedOptions);
            }
        }, 50);
        return () => {
            clearInterval(timerPropertyName);
            clearInterval(timerFromVariant);
            clearInterval(timerToVariant);
            clearInterval(timerDeepSwitch);
            clearInterval(timerFullDocument);
            clearInterval(timerExactMatch);
            clearInterval(timerPluginStayOpen);
            clearInterval(timerMainComponentName);
            clearInterval(timerShowAdvancedOptions);
        };
    }, []);

    // submit iff input fields are valid
    const submit = React.useCallback(() => {
        if (propertyName !== '' && toVariant !== '') {
            parent.postMessage(
                {
                    pluginMessage: {
                        action: 'submit',
                        propertyName,
                        fromVariant,
                        toVariant,
                        deepSwitch,
                        fullDocument,
                        exactMatch,
                        pluginStayOpen,
                        mainComponentName,
                        showAdvancedOptions,
                    },
                },
                '*'
            );
        }
    }, [
        propertyName,
        fromVariant,
        toVariant,
        deepSwitch,
        fullDocument,
        exactMatch,
        pluginStayOpen,
        mainComponentName,
        showAdvancedOptions,
    ]);

    return (
        <div>
            <div className={'input-row'}>
                <label className={'required'}>Property name</label>
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
                <label>From variant</label>{' '}
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
                <label className={'required'}>To variant</label>
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
            <div
                id={'dropdown-ui'}
                onClick={() => {
                    setShowAdvancedOptions(!showAdvancedOptions);
                    parent.postMessage(
                        {
                            pluginMessage: {
                                action: 'resize',
                                showAdvancedOptions: !showAdvancedOptions,
                            },
                        },
                        '*'
                    );
                }}
            >
                Advanced options
                <div id={'dropdown-icon'} className={!showAdvancedOptions ? 'flipped' : ''}>
                    <Dropdown />
                </div>
            </div>
            {showAdvancedOptions && (
                <>
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
                            <label
                                htmlFor={'swapChild'}
                                title={'Look into child layers after parent instances are switched'}
                            >
                                Deep switch
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
                                Switch full document
                            </label>
                            <div className={'hint-text'}>
                                {fullDocument === 'true' ? (
                                    <span>Plugin will switch the entire document</span>
                                ) : (
                                    <span>Plugin will only switch the current selection or the current page</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={'checkbox-row'} style={{ alignItems: 'center' }}>
                        <input
                            type={'checkbox'}
                            onChange={(e) => {
                                setExactMatch(e.target.value === 'true' ? 'false' : 'true');
                            }}
                            name={'exactMatch'}
                            value={exactMatch}
                            checked={exactMatch === 'true'}
                        />
                        <div
                            onClick={(e) => {
                                setExactMatch(exactMatch === 'true' ? 'false' : 'true');
                            }}
                            style={{ height: 'unset' }}
                        >
                            <label htmlFor={'exactMatch'} title={'Whether to do an exact match or a fuzzy search'}>
                                Exact match
                            </label>
                        </div>
                    </div>
                    <div className={'checkbox-row'} style={{ alignItems: 'center' }}>
                        <input
                            type={'checkbox'}
                            onChange={(e) => {
                                setPluginStayOpen(e.target.value === 'true' ? 'false' : 'true');
                            }}
                            name={'pluginStayOpen'}
                            value={pluginStayOpen}
                            checked={pluginStayOpen === 'true'}
                        />
                        <div
                            onClick={(e) => {
                                setPluginStayOpen(pluginStayOpen === 'true' ? 'false' : 'true');
                            }}
                            style={{ height: 'unset' }}
                        >
                            <label
                                htmlFor={'pluginStayOpen'}
                                title={'Whether the plugin will stay open after clicking "Switch Variants"'}
                            >
                                Plugin Stays Open
                            </label>
                        </div>
                    </div>
                    <div className={'input-row'}>
                        <label title={'Only switch instances with this main component name'}>Main component name</label>
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
                </>
            )}

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
                <button className={'primary'} onClick={submit} disabled={propertyName == '' || toVariant == ''}>
                    Switch variants
                </button>
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('react-page'));
