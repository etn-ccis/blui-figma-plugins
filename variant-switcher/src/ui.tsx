import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';

declare function require(path: string): any;

const App: React.FC = () => {
    const [propertyName, setPropertyName] = React.useState('Theme');
    const [fromVariant, setFromVariant] = React.useState('Light');
    const [toVariant, setToVariant] = React.useState('Dark');

    return (
        <div>
            <div className={'input-row'}>
                <label>Property Name</label>
                <input
                    onChange={(e) => setPropertyName(e.target.value)}
                    name={'Name of the property shared by instances'}
                    value={propertyName}
                />
            </div>
            <div className={'input-row'}>
                <label>From Variant</label>{' '}
                <input
                    onChange={(e) => setFromVariant(e.target.value)}
                    name={'The variant name to change from'}
                    value={fromVariant}
                />
            </div>
            <div className={'input-row'}>
                <label>To Variant</label>
                <input
                    onChange={(e) => setToVariant(e.target.value)}
                    name={'The variant name to change into'}
                    value={toVariant}
                />
            </div>

            <div className={'button-row'}>
                <button
                    onClick={() => {
                        const temp = fromVariant;
                        setFromVariant(toVariant);
                        setToVariant(temp);
                    }}
                >
                    From <img src={require('./exchange.svg')} /> To
                </button>
                <button
                    className={'primary'}
                    onClick={() => {
                        parent.postMessage({ pluginMessage: { propertyName, fromVariant, toVariant } }, '*');
                    }}
                    disabled={propertyName === '' || toVariant === ''}
                >
                    Change Variant
                </button>
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('react-page'));
