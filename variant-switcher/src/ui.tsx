import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { KEYS } from './shared';
import './ui.css';

declare function require(path: string): any;

const LOCAL_STORAGE_DATA = {};
onmessage = (event) => {
    LOCAL_STORAGE_DATA[event.data.pluginMessage.param] = event.data.pluginMessage.val;
};

// idk... react 17 does not like my <img src={require('./exchange.svg')} /> syntax?
const ExchangeIcon: React.FC = () => (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 4.08397H14M3 7.08397H14M3.27734 7.16794L7.27734 10.1679M13.7227 4L9.72266 1" stroke="black" />
    </svg>
);

const App: React.FC = () => {
    const [propertyName, setPropertyName] = React.useState('Theme');
    const [fromVariant, setFromVariant] = React.useState('Light');
    const [toVariant, setToVariant] = React.useState('Dark');
    const [deepSwap, setDeepSwap] = React.useState<'true' | 'false'>('false');

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
        const timerDeepSwap = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.DEEP_SWAP]) {
                setDeepSwap(LOCAL_STORAGE_DATA[KEYS.DEEP_SWAP]);
                clearInterval(timerDeepSwap);
            }
        }, 50);
        return () => {
            clearInterval(timerPropertyName);
            clearInterval(timerFromVariant);
            clearInterval(timerToVariant);
            clearInterval(timerDeepSwap);
        };
    }, []);

    // submit iff input fields are valid
    const submit = React.useCallback(() => {
        if (propertyName !== '' && toVariant !== '') {
            parent.postMessage({ pluginMessage: { propertyName, fromVariant, toVariant, deepSwap } }, '*');
        }
    }, [propertyName, fromVariant, toVariant, deepSwap]);

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
                        setDeepSwap(e.target.value === 'true' ? 'false' : 'true');
                    }}
                    name={'swapChild'}
                    value={deepSwap}
                    checked={deepSwap === 'true'}
                />
                <label htmlFor={'swapChild'}>
                    Deep swap
                    <div className={'hint-text'}>Swap child layers after parent instances are swapped</div>
                </label>
            </div>

            <div className={'button-row'}>
                <button
                    onClick={() => {
                        const temp = fromVariant;
                        setFromVariant(toVariant);
                        setToVariant(temp);
                    }}
                >
                    From {<ExchangeIcon />} To
                </button>
                <button className={'primary'} onClick={submit} disabled={propertyName === '' || toVariant === ''}>
                    Change Variant
                </button>
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('react-page'));
